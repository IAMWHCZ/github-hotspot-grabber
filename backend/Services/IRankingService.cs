using GitHubHotspotGrabber.Models;

namespace GitHubHotspotGrabber.Services;

public interface IRankingService
{
    Task<List<Repository>> CalculateHotspotScoresAsync(List<Repository> repositories);
    double CalculateHotspotScore(Repository repository);
    Task<List<Repository>> GetTopRepositoriesAsync(string? language = null, TimePeriod timePeriod = TimePeriod.Weekly, int limit = 50);
    Task<List<LanguageStats>> GetLanguageStatsAsync();
}