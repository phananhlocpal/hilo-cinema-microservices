using SaleService.OtherModels;
using System.Collections.Generic;

namespace SaleService.Dtos
{
    public class InvoiceReadDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DateOnly CreatedDate { get; set; }
        public int CustomerId { get; set; }
        public int? PromotionId { get; set; }
        public string? PaymentMethod { get; set; }
        public double? Total { get; set; }
        public string? Status { get; set; }
        public IEnumerable<RawSchedule> Schedules { get; set; }
        public Employee Employee { get; set; }
        public Customer Customer { get; set; }
        public List<InvoiceFoodReadDto> InvoiceFoods { get; set; } = new List<InvoiceFoodReadDto>();
    }
}
