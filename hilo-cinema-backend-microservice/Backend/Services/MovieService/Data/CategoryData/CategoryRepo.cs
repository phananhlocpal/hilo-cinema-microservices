using Microsoft.EntityFrameworkCore;
using MovieService.Models;
using System;

namespace MovieService.Data.CategoryData
{
    public class CategoryRepo : ICategoryRepo
    {
        private readonly MovieContext _context;

        public CategoryRepo(MovieContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category> GetByIdAsync(int id)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task InsertAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
        }

        public async Task HideCategoryAsync(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (category != null)
            {
                category.Status = "Inactive";  // Đổi trạng thái thành Inactive
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> CountAsync()
        {
            return await _context.Categories.CountAsync();
        }
    }
}
