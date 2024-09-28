using SaleService.Models;

namespace SaleService.Repositories.InvoiceRepository
{
    public interface IInvoiceRepo
    {
        Task<IEnumerable<Invoice>> GetAllInvoiceAsync();
        Task<Invoice> GetInvoiceByIdAsync(int invoiceId);
        Task<IEnumerable<Invoice>> GetInvoicesByCustomerId(int customerId);
        Task<Invoice> CreateInvoiceAsync(Invoice invoice);
        Task<Invoice> UpdateInvoiceAsync(Invoice invoice);
        Task<bool> DeleteInvoiceAsync(int invoiceId);
        Task<int> GetInvoiceCountAsync();
        Task<bool> SaveChangesAsync();
    }
}