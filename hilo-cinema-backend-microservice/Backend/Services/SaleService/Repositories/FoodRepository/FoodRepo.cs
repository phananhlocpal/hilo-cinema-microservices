using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SaleService.Models;

namespace SaleService.Repositories.FoodRepository
{
    public class FoodRepo : IFoodRepo
    {
        private readonly SaleContext _context;

        public FoodRepo(SaleContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<Food>> GetAllFoodAsync()
        {
            return await _context.Foods.ToListAsync();
        }

        public async Task<Food> GetFoodByIdAsync(int foodId)
        {
            return await _context.Foods.FindAsync(foodId);
        }

        public async Task<Food> CreateFoodAsync(Food food)
        {
            if (food == null)
            {
                throw new ArgumentNullException(nameof(food));
            }

            await _context.Foods.AddAsync(food);
            await SaveChangesAsync();
            return food;
        }

        public async Task<Food> UpdateFoodAsync(Food food)
        {
            if (food == null)
            {
                throw new ArgumentNullException(nameof(food));
            }

            _context.Foods.Update(food);
            await SaveChangesAsync();
            return food;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync() >= 0);
        }
    }
}
