using PromotionService.Models;

namespace PromotionService.Data
{
    public interface IPromotionRepository
    {
        Task<IEnumerable<Promotion>> GetAllAsync();
        Task<Promotion> GetByIdAsync(int id);
        Task InsertAsync(Promotion promotion);
        Task UpdateAsync(Promotion promotion);
        Task<bool> SaveChangesAsync();
    }
}
