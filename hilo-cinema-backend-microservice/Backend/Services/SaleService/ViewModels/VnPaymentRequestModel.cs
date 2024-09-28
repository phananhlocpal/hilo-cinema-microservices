using SaleService.Models;

namespace SaleService.ViewModels
{
    public class VnPaymentRequestModel
    {
        public int OrderId { get; set; }
        public string FullName { get; set; }
        public string Description { get; set; }
        public double Amount { get; set; }  
        public DateTime CreatedDate { get; set; }
        public InvoiceRequestModel Invoice { get; set; }
    }
}
