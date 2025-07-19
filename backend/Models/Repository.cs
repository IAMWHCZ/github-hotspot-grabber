using System.ComponentModel.DataAnnotations;

namespace GitHubHotspotGrabber.Models;

public class Repository
{
    [Key]
    public int Id { get; set; }
    
    public long GitHubId { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string FullName { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public string Owner { get; set; } = string.Empty;
    
    public string Language { get; set; } = string.Empty;
    
    public int Stars { get; set; }
    
    public int Forks { get; set; }
    
    public int OpenIssues { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    public DateTime UpdatedAt { get; set; }
    
    public DateTime PushedAt { get; set; }
    
    public string HtmlUrl { get; set; } = string.Empty;
    
    public string CloneUrl { get; set; } = string.Empty;
    
    public double HotspotScore { get; set; }
    
    public DateTime LastAnalyzed { get; set; }
    
    // 计算属性
    public int DaysSinceCreated => (DateTime.UtcNow - CreatedAt).Days;
    
    public int DaysSinceLastPush => (DateTime.UtcNow - PushedAt).Days;
}