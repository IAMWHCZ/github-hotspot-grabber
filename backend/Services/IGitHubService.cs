using GitHubHotspotGrabber.Models;

namespace GitHubHotspotGrabber.Services;

public interface IGitHubService
{
    Task<List<Repository>> GetTrendingRepositoriesAsync(string? language = null, TimePeriod timePeriod = TimePeriod.Weekly, int limit = 50);
    Task<Repository?> GetRepositoryDetailsAsync(string owner, string name);
    Task<List<string>> GetPopularLanguagesAsync();
}