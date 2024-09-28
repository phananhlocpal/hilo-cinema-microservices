
using MovieService.Models;

namespace MovieService.Data.CategoryData
{
    public interface ICategoryRepo
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Task<Category> GetByIdAsync(int id);
        Task InsertAsync(Category category);
        Task UpdateAsync(Category category);
        Task HideCategoryAsync(int id);
        Task<int> CountAsync();
    }
}
