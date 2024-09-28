using Microsoft.EntityFrameworkCore;
using PromotionService.Models;

namespace PromotionService.Data
{
    public class PromotionDbContext : DbContext
    {
        public PromotionDbContext(DbContextOptions<PromotionDbContext> options) : base(options)
        {
        }

        public virtual DbSet<Promotion> Promotion { get; set; }
    }
}
