using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SaleService.Models;

public partial class SaleContext : DbContext
{
    public SaleContext()
    {
    }

    public SaleContext(DbContextOptions<SaleContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Food> Foods { get; set; }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<InvoiceFood> InvoiceFoods { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=Sale;Integrated Security=True;Encrypt=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Food>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__food__3213E83F7E729110");

            entity.ToTable("food");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CostPrice).HasColumnName("cost_price");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .HasColumnName("name");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.Profit).HasColumnName("profit");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasColumnName("status");
            entity.Property(e => e.Stock).HasColumnName("stock");
            entity.Property(e => e.Img)
                .HasColumnType("image")
                .HasColumnName("img");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__invoice__3213E83F0EC19587");

            entity.ToTable("invoice");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedDate).HasColumnName("created_date");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(30)
                .HasColumnName("payment_method");
            entity.Property(e => e.PromotionId).HasColumnName("promotion_id");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasColumnName("status");
            entity.Property(e => e.Total)
                .HasColumnName("total")
                .HasColumnType("FLOAT");
        });

        modelBuilder.Entity<InvoiceFood>(entity =>
        {
            entity.HasKey(e => new { e.InvoiceId, e.FoodId }).HasName("PK__invoice___67793994558E6380");

            entity.ToTable("invoice_food");

            entity.Property(e => e.InvoiceId).HasColumnName("invoice_id");
            entity.Property(e => e.FoodId).HasColumnName("food_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");

            entity.HasOne(d => d.Food).WithMany(p => p.InvoiceFoods)
                .HasForeignKey(d => d.FoodId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__invoice_f__food___5DCAEF64");

            entity.HasOne(d => d.Invoice).WithMany(p => p.InvoiceFoods)
                .HasForeignKey(d => d.InvoiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__invoice_f__invoi__5CD6CB2B");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
