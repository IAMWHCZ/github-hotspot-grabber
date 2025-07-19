using GitHubHotspotGrabber.Models;
using Microsoft.EntityFrameworkCore;

namespace GitHubHotspotGrabber.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Repository> Repositories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 配置 Repository 实体
        modelBuilder.Entity<Repository>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.GitHubId).IsUnique();
            entity.HasIndex(e => e.Language);
            entity.HasIndex(e => e.HotspotScore);
            entity.HasIndex(e => e.Stars);
            entity.HasIndex(e => e.UpdatedAt);
            
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.Owner).HasMaxLength(100);
            entity.Property(e => e.Language).HasMaxLength(50);
            entity.Property(e => e.HtmlUrl).HasMaxLength(500);
            entity.Property(e => e.CloneUrl).HasMaxLength(500);
            entity.Property(e => e.Description).HasMaxLength(1000);
        });
    }
}