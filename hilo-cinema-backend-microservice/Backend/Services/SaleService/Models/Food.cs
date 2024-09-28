using System;
using System.Collections.Generic;

namespace SaleService.Models;

public partial class Food
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public double? CostPrice { get; set; }

    public double? Price { get; set; }

    public double? Profit { get; set; }

    public int? Stock { get; set; }
    public byte[] Img { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<InvoiceFood> InvoiceFoods { get; set; } = new List<InvoiceFood>();
}
