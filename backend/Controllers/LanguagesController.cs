using GitHubHotspotGrabber.Services;
using Microsoft.AspNetCore.Mvc;

namespace GitHubHotspotGrabber.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LanguagesController : ControllerBase
{
    private readonly IGitHubService _gitHubService;
    private readonly IRankingService _rankingService;
    private readonly ILogger<LanguagesController> _logger;

    public LanguagesController(
        IGitHubService gitHubService,
        IRankingService rankingService,
        ILogger<LanguagesController> logger)
    {
        _gitHubService = gitHubService;
        _rankingService = rankingService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<string>>> GetLanguages()
    {
        try
        {
            var languages = await _gitHubService.GetPopularLanguagesAsync();
            return Ok(languages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting languages");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("stats")]
    public async Task<ActionResult> GetLanguageStats()
    {
        try
        {
            var stats = await _rankingService.GetLanguageStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting language stats");
            return StatusCode(500, "Internal server error");
        }
    }
}