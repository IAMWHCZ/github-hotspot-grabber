namespace GitHubHotspotGrabber.Models;

public class WeightConfig
{
    public double Stars { get; set; } = 0.35;
    public double Forks { get; set; } = 0.25;
    public double Issues { get; set; } = 0.15;
    public double Freshness { get; set; } = 0.15;
    public double Activity { get; set; } = 0.10;

    public bool IsValid()
    {
        var total = Stars + Forks + Issues + Freshness + Activity;
        return Math.Abs(total - 1.0) < 0.01; // 允许小的浮点误差
    }

    public void Normalize()
    {
        var total = Stars + Forks + Issues + Freshness + Activity;
        if (total > 0)
        {
            Stars /= total;
            Forks /= total;
            Issues /= total;
            Freshness /= total;
            Activity /= total;
        }
    }
}