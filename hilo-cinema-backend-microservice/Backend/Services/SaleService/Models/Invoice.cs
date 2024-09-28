using System;
using System.Collections.Generic;

namespace SaleService.Models;

public partial class Invoice
{
    public int Id { get; set; }
    public DateOnly CreatedDate { get; set; }

    public int EmployeeId { get; set; }

    public int CustomerId { get; set; }

    public int? PromotionId { get; set; }

    public string? PaymentMethod { get; set; }

    public double? Total { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<InvoiceFood> InvoiceFoods { get; set; } = new List<InvoiceFood>();
}
