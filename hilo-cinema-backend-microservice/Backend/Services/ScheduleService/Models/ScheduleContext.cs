using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ScheduleService.Models;

public partial class ScheduleContext : DbContext
{
    public ScheduleContext()
    {
    }

    public ScheduleContext(DbContextOptions<ScheduleContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Schedule> Schedules { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=Schedule;Integrated Security=True;Encrypt=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => new { e.MovieId, e.Date, e.Time, e.SeatId }).HasName("PK__schedule__606EEAF664D4287A");

            entity.ToTable("schedule");

            entity.Property(e => e.MovieId).HasColumnName("movie_id");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.Time).HasColumnName("time");
            entity.Property(e => e.SeatId).HasColumnName("seat_id");
            entity.Property(e => e.InvoiceId).HasColumnName("invoice_id");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
