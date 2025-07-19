namespace GitHubHotspotGrabber.Models;

public class TrendingRequest
{
    public string? Language { get; set; }
    public TimePeriod TimePeriod { get; set; } = TimePeriod.Weekly;
    public int Limit { get; set; } = 50;
    public int Page { get; set; } = 1;
}

public enum TimePeriod
{
    Daily,
    Weekly,
    Monthly
}