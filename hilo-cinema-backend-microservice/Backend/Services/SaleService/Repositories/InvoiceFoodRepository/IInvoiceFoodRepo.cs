using SaleService.Models;

namespace SaleService.Repositories.InvoiceFoodRepository
{
    public interface IInvoiceFoodRepo
    {
        Task<IEnumerable<InvoiceFood>> GetAllInvoiceFoodAsync();
        Task<InvoiceFood> GetInvoiceFoodByInvoiceIdAsync(int invoiceId);
        Task<InvoiceFood> GetInvoiceFoodByFoodIdAsync(int foodId);
        Task<InvoiceFood> CreateInvoiceFoodAsync(InvoiceFood food);
        Task<InvoiceFood> UpdateInvoiceFoodAsync(InvoiceFood food);
        Task<bool> DeleteInvoiceFoodByInvoiceIdAsync(int invoiceId);
        Task<List<InvoiceFood>> GetInvoiceFoodsByInvoiceIdAsync(int invoiceId);
        Task<bool> SaveChangesAsync();
    }
}
