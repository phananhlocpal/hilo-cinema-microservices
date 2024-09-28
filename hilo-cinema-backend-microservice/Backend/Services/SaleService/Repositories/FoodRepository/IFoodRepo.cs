using SaleService.Models;

namespace SaleService.Repositories.FoodRepository
{
    public interface IFoodRepo
    {
        Task<IEnumerable<Food>> GetAllFoodAsync();
        Task<Food> GetFoodByIdAsync(int foodId);
        Task<Food> CreateFoodAsync(Food food);
        Task<Food> UpdateFoodAsync(Food food);
        Task<bool> SaveChangesAsync();
    }
}
