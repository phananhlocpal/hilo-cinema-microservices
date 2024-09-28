using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TheaterService.Models;

public partial class TheaterContext : DbContext
{
    public TheaterContext()
    {
    }

    public TheaterContext(DbContextOptions<TheaterContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Room> Rooms { get; set; }

    public virtual DbSet<Seat> Seats { get; set; }

    public virtual DbSet<Theater> Theaters { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=Theater;Integrated Security=True;Encrypt=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Room>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__room__3213E83F121E7409");

            entity.ToTable("room");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ColNum).HasColumnName("col_num");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .HasColumnName("name");
            entity.Property(e => e.RowNum).HasColumnName("row_num");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasColumnName("status");
            entity.Property(e => e.TheaterId).HasColumnName("theater_id");

            entity.HasOne(d => d.Theater).WithMany(p => p.Rooms)
                .HasForeignKey(d => d.TheaterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__room__theater_id__3A81B327");
        });

        modelBuilder.Entity<Seat>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__seat__3213E83FB530A813");

            entity.ToTable("seat");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ColSeat).HasColumnName("col_seat");
            entity.Property(e => e.Name)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.RoomId).HasColumnName("room_id");
            entity.Property(e => e.RowSeat).HasColumnName("row_seat");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasColumnName("status");
            entity.Property(e => e.Type)
                .HasMaxLength(30)
                .HasColumnName("type");

            entity.HasOne(d => d.Room).WithMany(p => p.Seats)
                .HasForeignKey(d => d.RoomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__seat__room_id__49C3F6B7");
        });

        modelBuilder.Entity<Theater>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__theater__3213E83FB0B2B0E7");

            entity.ToTable("theater");

            entity.HasIndex(e => e.Name, "UQ__theater__72E12F1B226E66DB").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.City)
                .HasMaxLength(30)
                .HasColumnName("city");
            entity.Property(e => e.DetailAddress)
                .HasMaxLength(100)
                .HasColumnName("detail_address");
            entity.Property(e => e.Hotline)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("hotline");
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
