using GitHubHotspotGrabber.Data;
using GitHubHotspotGrabber.Models;
using GitHubHotspotGrabber.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GitHubHotspotGrabber.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RepositoriesController : ControllerBase
{
    private readonly IGitHubService _gitHubService;
    private readonly IRankingService _rankingService;
    private readonly ICacheService _cacheService;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<RepositoriesController> _logger;

    public RepositoriesController(
        IGitHubService gitHubService,
        IRankingService rankingService,
        ICacheService cacheService,
        ApplicationDbContext context,
        ILogger<RepositoriesController> logger)
    {
        _gitHubService = gitHubService;
        _rankingService = rankingService;
        _cacheService = cacheService;
        _context = context;
        _logger = logger;
    }

    [HttpGet("trending")]
    public async Task<ActionResult<TrendingResponse>> GetTrending([FromQuery] TrendingRequest request)
    {
        try
        {
            var cacheKey = $"trending_{request.Language}_{request.TimePeriod}_{request.Limit}_{request.Page}";
            
            // 尝试从缓存获取
            var cachedResult = await _cacheService.GetAsync<TrendingResponse>(cacheKey);
            if (cachedResult != null)
            {
                _logger.LogInformation("Returning cached trending repositories");
                return Ok(cachedResult);
            }

            // 从 GitHub API 获取数据
            var repositories = await _gitHubService.GetTrendingRepositoriesAsync(
                request.Language, 
                request.TimePeriod, 
                request.Limit);

            if (!repositories.Any())
            {
                return Ok(new TrendingResponse
                {
                    Repositories = new List<Repository>(),
                    TotalCount = 0,
                    Page = request.Page,
                    PageSize = request.Limit,
                    Language = request.Language,
                    TimePeriod = request.TimePeriod
                });
            }

            // 计算热度分数
            var rankedRepositories = await _rankingService.CalculateHotspotScoresAsync(repositories);

            // 保存到数据库
            await SaveRepositoriesToDatabase(rankedRepositories);

            // 分页
            var pagedRepositories = rankedRepositories
                .Skip((request.Page - 1) * request.Limit)
                .Take(request.Limit)
                .ToList();

            var response = new TrendingResponse
            {
                Repositories = pagedRepositories,
                TotalCount = rankedRepositories.Count,
                Page = request.Page,
                PageSize = request.Limit,
                Language = request.Language,
                TimePeriod = request.TimePeriod
            };

            // 缓存结果
            await _cacheService.SetAsync(cacheKey, response, TimeSpan.FromMinutes(15));

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting trending repositories");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<Repository>>> Search([FromQuery] string query, [FromQuery] int limit = 20)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query parameter is required");
            }

            var repositories = await _context.Repositories
                .Where(r => r.Name.Contains(query) || 
                           r.Description.Contains(query) || 
                           r.FullName.Contains(query))
                .OrderByDescending(r => r.HotspotScore)
                .Take(limit)
                .ToListAsync();

            return Ok(repositories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching repositories");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{owner}/{name}")]
    public async Task<ActionResult<Repository>> GetRepository(string owner, string name)
    {
        try
        {
            // 先从数据库查找
            var repository = await _context.Repositories
                .FirstOrDefaultAsync(r => r.FullName == $"{owner}/{name}");

            if (repository == null)
            {
                // 如果数据库中没有，从 GitHub API 获取
                repository = await _gitHubService.GetRepositoryDetailsAsync(owner, name);
                if (repository == null)
                {
                    return NotFound();
                }

                // 计算热度分数
                repository.HotspotScore = _rankingService.CalculateHotspotScore(repository);
                
                // 保存到数据库
                _context.Repositories.Add(repository);
                await _context.SaveChangesAsync();
            }

            return Ok(repository);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting repository {Owner}/{Name}", owner, name);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("refresh")]
    public async Task<ActionResult> RefreshData([FromBody] TrendingRequest request)
    {
        try
        {
            // 清除相关缓存
            var cacheKey = $"trending_{request.Language}_{request.TimePeriod}_{request.Limit}_1";
            await _cacheService.RemoveAsync(cacheKey);

            // 强制从 GitHub API 获取最新数据
            var repositories = await _gitHubService.GetTrendingRepositoriesAsync(
                request.Language, 
                request.TimePeriod, 
                request.Limit);

            var rankedRepositories = await _rankingService.CalculateHotspotScoresAsync(repositories);
            await SaveRepositoriesToDatabase(rankedRepositories);

            return Ok(new { message = "Data refreshed successfully", count = repositories.Count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing data");
            return StatusCode(500, "Internal server error");
        }
    }

    private async Task SaveRepositoriesToDatabase(List<Repository> repositories)
    {
        foreach (var repo in repositories)
        {
            var existingRepo = await _context.Repositories
                .FirstOrDefaultAsync(r => r.GitHubId == repo.GitHubId);

            if (existingRepo != null)
            {
                // 更新现有记录
                existingRepo.Stars = repo.Stars;
                existingRepo.Forks = repo.Forks;
                existingRepo.OpenIssues = repo.OpenIssues;
                existingRepo.UpdatedAt = repo.UpdatedAt;
                existingRepo.PushedAt = repo.PushedAt;
                existingRepo.HotspotScore = repo.HotspotScore;
                existingRepo.LastAnalyzed = DateTime.UtcNow;
            }
            else
            {
                // 添加新记录
                _context.Repositories.Add(repo);
            }
        }

        await _context.SaveChangesAsync();
    }
}