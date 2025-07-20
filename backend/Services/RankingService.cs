using GitHubHotspotGrabber.Data;
using GitHubHotspotGrabber.Models;
using Microsoft.EntityFrameworkCore;

namespace GitHubHotspotGrabber.Services;

public class RankingService : IRankingService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<RankingService> _logger;

    // 权重配置
    private readonly double _starWeight;
    private readonly double _forkWeight;
    private readonly double _issueWeight;
    private readonly double _freshnessWeight;
    private readonly double _activityWeight;

    public RankingService(ApplicationDbContext context, IConfiguration configuration, ILogger<RankingService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;

        // 从配置读取权重，如果没有配置则使用默认值
        _starWeight = _configuration.GetValue<double>("RankingWeights:Stars", 0.35);
        _forkWeight = _configuration.GetValue<double>("RankingWeights:Forks", 0.25);
        _issueWeight = _configuration.GetValue<double>("RankingWeights:Issues", 0.15);
        _freshnessWeight = _configuration.GetValue<double>("RankingWeights:Freshness", 0.15);
        _activityWeight = _configuration.GetValue<double>("RankingWeights:Activity", 0.10);
    }

    public async Task<List<Repository>> CalculateHotspotScoresAsync(List<Repository> repositories)
    {
        foreach (var repo in repositories)
        {
            repo.HotspotScore = CalculateHotspotScore(repo);
        }

        // 按热度分数排序
        return repositories.OrderByDescending(r => r.HotspotScore).ToList();
    }

    public double CalculateHotspotScore(Repository repository)
    {
        try
        {
            // 计算时间因子
            var daysSinceCreated = Math.Max(1, repository.DaysSinceCreated);
            var daysSinceLastPush = Math.Max(1, repository.DaysSinceLastPush);

            // 1. Stars 权重 - 基于星标增长速度
            var starVelocity = (double)repository.Stars / daysSinceCreated;
            var starScore = Math.Log10(starVelocity + 1);

            // 2. Forks 权重 - 基于分叉增长速度
            var forkVelocity = (double)repository.Forks / daysSinceCreated;
            var forkScore = Math.Log10(forkVelocity + 1);

            // 3. Issues 权重 - 活跃的 issue 讨论表明项目受关注
            var issueScore = Math.Log10(repository.OpenIssues + 1) / daysSinceCreated;

            // 4. Freshness 权重 - 项目新鲜度（越新越有潜力）
            var freshnessScore = Math.Max(0.1, 1.0 / Math.Sqrt(daysSinceCreated));

            // 5. Activity 权重 - 最近活跃度（最近推送越频繁分数越高）
            var activityScore = Math.Max(0.1, 1.0 / daysSinceLastPush);

            // 综合评分
            var score = (_starWeight * starScore) + 
                       (_forkWeight * forkScore) + 
                       (_issueWeight * issueScore) +
                       (_freshnessWeight * freshnessScore) +
                       (_activityWeight * activityScore);

            // 缩放到合理范围
            return score * 10;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating hotspot score for repository {RepoName}", repository.FullName);
            return 0;
        }
    }

    public async Task<List<Repository>> GetTopRepositoriesAsync(string? language = null, TimePeriod timePeriod = TimePeriod.Weekly, int limit = 50)
    {
        var query = _context.Repositories.AsQueryable();

        // 按语言筛选
        if (!string.IsNullOrEmpty(language))
        {
            query = query.Where(r => r.Language.ToLower() == language.ToLower());
        }

        // 按时间段筛选
        var cutoffDate = GetCutoffDate(timePeriod);
        query = query.Where(r => r.CreatedAt >= cutoffDate || r.UpdatedAt >= cutoffDate);

        // 按热度分数排序并限制数量
        var repositories = await query
            .OrderByDescending(r => r.HotspotScore)
            .Take(limit)
            .ToListAsync();

        return repositories;
    }

    public async Task<List<LanguageStats>> GetLanguageStatsAsync()
    {
        var stats = await _context.Repositories
            .Where(r => !string.IsNullOrEmpty(r.Language))
            .GroupBy(r => r.Language)
            .Select(g => new LanguageStats
            {
                Language = g.Key,
                RepositoryCount = g.Count(),
                AverageStars = g.Average(r => r.Stars),
                AverageScore = g.Average(r => r.HotspotScore)
            })
            .OrderByDescending(s => s.RepositoryCount)
            .Take(20)
            .ToListAsync();

        return stats;
    }

    private DateTime GetCutoffDate(TimePeriod timePeriod)
    {
        return timePeriod switch
        {
            TimePeriod.Daily => DateTime.UtcNow.AddDays(-1),
            TimePeriod.Weekly => DateTime.UtcNow.AddDays(-7),
            TimePeriod.Monthly => DateTime.UtcNow.AddDays(-30),
            _ => DateTime.UtcNow.AddDays(-7)
        };
    }
}