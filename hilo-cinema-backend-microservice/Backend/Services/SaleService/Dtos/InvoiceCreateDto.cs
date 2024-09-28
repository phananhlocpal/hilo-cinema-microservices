using SaleService.OtherModels;
using System;

namespace SaleService.Dtos
{
    public class InvoiceCreateDto
    {
        public int EmployeeId { get; set; }
        public int CustomerId { get; set; }
        public int? PromotionId { get; set; }
        public DateOnly CreatedDate { get; set; }
        public string? PaymentMethod { get; set; }
        public float? Total { get; set; }
        public string? Status { get; set; }
        public IEnumerable<Schedule> Schedules { get; set; } // create invoice => update schedule
        public IEnumerable<InvoiceFoodCreateDto>? InvoiceFoods { get; set; }
    }
}
