namespace GitHubHotspotGrabber.Models;

public class TrendingResponse
{
    public List<Repository> Repositories { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public string? Language { get; set; }
    public TimePeriod TimePeriod { get; set; }
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}

public class LanguageStats
{
    public string Language { get; set; } = string.Empty;
    public int RepositoryCount { get; set; }
    public double AverageStars { get; set; }
    public double AverageScore { get; set; }
}