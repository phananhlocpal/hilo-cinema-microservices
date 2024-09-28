using SaleService.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SaleService.Repositories.InvoiceFoodRepository
{
    public class InvoiceFoodRepo : IInvoiceFoodRepo
    {
        private readonly SaleContext _context;

        public InvoiceFoodRepo(SaleContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<InvoiceFood>> GetAllInvoiceFoodAsync()
        {
            return await _context.InvoiceFoods.ToListAsync();
        }

        public async Task<InvoiceFood> GetInvoiceFoodByInvoiceIdAsync(int invoiceId)
        {
            return await _context.InvoiceFoods.FirstOrDefaultAsync(invoiceFood => invoiceFood.InvoiceId == invoiceId) ;
        }

        public async Task<InvoiceFood> GetInvoiceFoodByFoodIdAsync(int foodId)
        {
            return await _context.InvoiceFoods.FirstOrDefaultAsync(invoiceFood => invoiceFood.FoodId == foodId) ;
        }

        public async Task<InvoiceFood> CreateInvoiceFoodAsync(InvoiceFood invoiceFood)
        {
            if (invoiceFood == null)
            {
                throw new ArgumentNullException(nameof(invoiceFood));
            }

            await _context.InvoiceFoods.AddAsync(invoiceFood);
            await SaveChangesAsync();
            return invoiceFood;
        }

        public async Task<InvoiceFood> UpdateInvoiceFoodAsync(InvoiceFood invoiceFood)
        {
            if (invoiceFood == null)
            {
                throw new ArgumentNullException(nameof(invoiceFood));
            }

            _context.InvoiceFoods.Update(invoiceFood);
            await SaveChangesAsync();
            return invoiceFood;
        }

        public async Task<bool> DeleteInvoiceFoodByInvoiceIdAsync(int invoiceId)
        {
            var invoiceFoods = await _context.InvoiceFoods
                .Where(i => i.InvoiceId == invoiceId)
                .ToListAsync();

            if (invoiceFoods == null || !invoiceFoods.Any())
            {
                return false;
            }

            _context.InvoiceFoods.RemoveRange(invoiceFoods);
            return await SaveChangesAsync();
        }

        public async Task<List<InvoiceFood>> GetInvoiceFoodsByInvoiceIdAsync(int invoiceId)
        {
            var invoiceFoods = await _context.InvoiceFoods
                 .Where(i => i.InvoiceId == invoiceId)
                 .ToListAsync();

            return invoiceFoods;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync() >= 0);
        }
    }
}
