using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MovieService.Models;

public partial class MovieContext : DbContext
{
    public MovieContext()
    {
    }

    public MovieContext(DbContextOptions<MovieContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Actor> Actors { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Movie> Movies { get; set; }

    public virtual DbSet<Producer> Producers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=Movie;Integrated Security=True;Encrypt=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Actor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__actor__3213E83F0C9BF7AF");

            entity.ToTable("actor");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .HasColumnName("description");
            entity.Property(e => e.Img)
                .HasColumnType("image")
                .HasColumnName("img");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .HasColumnName("name");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasColumnName("status");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__categori__3213E83F052696EB");

            entity.ToTable("categories");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .HasColumnName("name");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasColumnName("status");
        });

        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__movie__3213E83F1041D94B");

            entity.ToTable("movie");

            entity.HasIndex(e => e.MovieUrl, "UQ__movie__8681CDD12DC2E736").IsUnique();

            entity.HasIndex(e => e.Title, "UQ__movie__E52A1BB36F35F4B1").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Country)
                .HasMaxLength(20)
                .HasColumnName("country");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .HasColumnName("description");
            entity.Property(e => e.Director)
                .HasMaxLength(30)
                .HasColumnName("director");
            entity.Property(e => e.Duration).HasColumnName("duration");
            entity.Property(e => e.ImgLarge)
                .HasColumnType("image")
                .HasColumnName("img_large");
            entity.Property(e => e.ImgSmall)
                .HasColumnType("image")
                .HasColumnName("img_small");
            entity.Property(e => e.MovieType)
                .HasMaxLength(15)
                .HasColumnName("movie_type");
            entity.Property(e => e.MovieUrl)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("movie_url");
            entity.Property(e => e.Rate).HasColumnName("rate");
            entity.Property(e => e.ReleasedDate).HasColumnName("released_date");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(30)
                .HasColumnName("title");
            entity.Property(e => e.Trailer)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("trailer");

            entity.HasMany(d => d.Actors).WithMany(p => p.Movies)
                .UsingEntity<Dictionary<string, object>>(
                    "MovieActor",
                    r => r.HasOne<Actor>().WithMany()
                        .HasForeignKey("ActorId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__movie_act__actor__5DCAEF64"),
                    l => l.HasOne<Movie>().WithMany()
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__movie_act__movie__5CD6CB2B"),
                    j =>
                    {
                        j.HasKey("MovieId", "ActorId").HasName("PK__movie_ac__DB7FB332CB4F9661");
                        j.ToTable("movie_actor");
                        j.IndexerProperty<int>("MovieId").HasColumnName("movie_id");
                        j.IndexerProperty<int>("ActorId").HasColumnName("actor_id");
                    });

            entity.HasMany(d => d.Categories).WithMany(p => p.Movies)
                .UsingEntity<Dictionary<string, object>>(
                    "MovieCategory",
                    r => r.HasOne<Category>().WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__movie_cat__categ__52593CB8"),
                    l => l.HasOne<Movie>().WithMany()
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__movie_cat__movie__5165187F"),
                    j =>
                    {
                        j.HasKey("MovieId", "CategoryId").HasName("PK__movie_ca__DE9919D26837B4E7");
                        j.ToTable("movie_category");
                        j.IndexerProperty<int>("MovieId").HasColumnName("movie_id");
                        j.IndexerProperty<int>("CategoryId").HasColumnName("category_id");
                    });

            entity.HasMany(d => d.Producers).WithMany(p => p.Movies)
                .UsingEntity<Dictionary<string, object>>(
                    "MovieProducer",
                    r => r.HasOne<Producer>().WithMany()
                        .HasForeignKey("ProducerId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__movie_pro__produ__5812160E"),
                    l => l.HasOne<Movie>().WithMany()
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__movie_pro__movie__571DF1D5"),
                    j =>
                    {
                        j.HasKey("MovieId", "ProducerId").HasName("PK__movie_pr__1D6A044513A8395B");
                        j.ToTable("movie_producer");
                        j.IndexerProperty<int>("MovieId").HasColumnName("movie_id");
                        j.IndexerProperty<int>("ProducerId").HasColumnName("producer_id");
                    });
        });

        modelBuilder.Entity<Producer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__producer__3213E83FAAEFCE28");

            entity.ToTable("producer");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .HasColumnName("description");
            entity.Property(e => e.Img)
                .HasColumnType("image")
                .HasColumnName("img");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .HasColumnName("name");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasColumnName("status");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
