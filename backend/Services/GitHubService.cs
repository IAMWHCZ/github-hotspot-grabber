using GitHubHotspotGrabber.Models;
using System.Text.Json;

namespace GitHubHotspotGrabber.Services;

public class GitHubService : IGitHubService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<GitHubService> _logger;

    public GitHubService(HttpClient httpClient, IConfiguration configuration, ILogger<GitHubService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
        
        // 配置 GitHub API 请求头
        var token = _configuration["GitHub:Token"];
        _logger.LogInformation("GitHub token configured: {HasToken}", !string.IsNullOrEmpty(token));
        if (!string.IsNullOrEmpty(token))
        {
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"token {token}");
        }
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "GitHubHotspotGrabber/1.0");
        _httpClient.DefaultRequestHeaders.Add("Accept", "application/vnd.github.v3+json");
    }

    public async Task<List<Repository>> GetTrendingRepositoriesAsync(string? language = null, TimePeriod timePeriod = TimePeriod.Weekly, int limit = 50)
    {
        try
        {
            var dateRange = GetDateRange(timePeriod);
            var query = $"created:>{dateRange:yyyy-MM-dd}";
            
            if (!string.IsNullOrEmpty(language))
            {
                query += $" language:{language}";
            }

            var url = $"https://api.github.com/search/repositories?q={Uri.EscapeDataString(query)}&sort=stars&order=desc&per_page={Math.Min(limit, 100)}";
            
            _logger.LogInformation("Fetching trending repositories: {Url}", url);
            
            var response = await _httpClient.GetAsync(url);
            
            // If unauthorized, try without authentication (rate limited but works for testing)
            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                _logger.LogWarning("GitHub API returned 401, trying without authentication (rate limited)");
                using var tempClient = new HttpClient();
                tempClient.DefaultRequestHeaders.Add("User-Agent", "GitHubHotspotGrabber/1.0");
                tempClient.DefaultRequestHeaders.Add("Accept", "application/vnd.github.v3+json");
                response = await tempClient.GetAsync(url);
            }
            
            response.EnsureSuccessStatusCode();
            
            var content = await response.Content.ReadAsStringAsync();
            var searchResult = JsonSerializer.Deserialize<GitHubSearchResult>(content, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
            });

            return searchResult?.Items?.Select(MapToRepository).ToList() ?? new List<Repository>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching trending repositories");
            return new List<Repository>();
        }
    }

    public async Task<Repository?> GetRepositoryDetailsAsync(string owner, string name)
    {
        try
        {
            var url = $"https://api.github.com/repos/{owner}/{name}";
            var response = await _httpClient.GetAsync(url);
            
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }
            
            var content = await response.Content.ReadAsStringAsync();
            var repoData = JsonSerializer.Deserialize<GitHubRepository>(content, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
            });

            return repoData != null ? MapToRepository(repoData) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching repository details for {Owner}/{Name}", owner, name);
            return null;
        }
    }

    public async Task<List<string>> GetPopularLanguagesAsync()
    {
        // 返回常用编程语言列表
        return await Task.FromResult(new List<string>
        {
            "JavaScript", "Python", "Java", "TypeScript", "C#", "PHP", "C++", "C", "Shell", "Ruby",
            "Go", "Rust", "Kotlin", "Swift", "Scala", "Dart", "R", "Objective-C", "Perl", "Haskell"
        });
    }

    private DateTime GetDateRange(TimePeriod timePeriod)
    {
        return timePeriod switch
        {
            TimePeriod.Daily => DateTime.UtcNow.AddDays(-1),
            TimePeriod.Weekly => DateTime.UtcNow.AddDays(-7),
            TimePeriod.Monthly => DateTime.UtcNow.AddDays(-30),
            _ => DateTime.UtcNow.AddDays(-7)
        };
    }

    private Repository MapToRepository(GitHubRepository repo)
    {
        return new Repository
        {
            GitHubId = repo.Id,
            Name = repo.Name ?? string.Empty,
            FullName = repo.FullName ?? string.Empty,
            Description = repo.Description ?? string.Empty,
            Owner = repo.Owner?.Login ?? string.Empty,
            Language = repo.Language ?? string.Empty,
            Stars = repo.StargazersCount,
            Forks = repo.ForksCount,
            OpenIssues = repo.OpenIssuesCount,
            CreatedAt = repo.CreatedAt,
            UpdatedAt = repo.UpdatedAt,
            PushedAt = repo.PushedAt,
            HtmlUrl = repo.HtmlUrl ?? string.Empty,
            CloneUrl = repo.CloneUrl ?? string.Empty,
            LastAnalyzed = DateTime.UtcNow
        };
    }
}

// GitHub API 响应模型
public class GitHubSearchResult
{
    public List<GitHubRepository>? Items { get; set; }
    public int TotalCount { get; set; }
}

public class GitHubRepository
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? FullName { get; set; }
    public string? Description { get; set; }
    public GitHubUser? Owner { get; set; }
    public string? Language { get; set; }
    public int StargazersCount { get; set; }
    public int ForksCount { get; set; }
    public int OpenIssuesCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime PushedAt { get; set; }
    public string? HtmlUrl { get; set; }
    public string? CloneUrl { get; set; }
}

public class GitHubUser
{
    public string? Login { get; set; }
}