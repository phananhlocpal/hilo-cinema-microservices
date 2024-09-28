using PromotionService.Models;

namespace PromotionService.Data
{
    public class PromotionRepository : IPromotionRepository
    {
        private readonly PromotionDbContext _context;
        public PromotionRepository(PromotionDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Promotion>> GetAllAsync()
        {
            return _context.Promotion.ToList();
        }

        public async Task<Promotion> GetByIdAsync(int id)
        {
            return _context.Promotion.FirstOrDefault(x => x.Id == id);
        }

        public async Task InsertAsync(Promotion promotion)
        {
            await _context.Promotion.AddAsync(promotion);
        }

        public async Task UpdateAsync(Promotion promotion)
        {
            var currentPromotion = await _context.Promotion.FindAsync(promotion.Id);
            if (currentPromotion != null)
            {
                _context.Entry(currentPromotion).CurrentValues.SetValues(promotion);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() >= 0;
        }
    }
}
