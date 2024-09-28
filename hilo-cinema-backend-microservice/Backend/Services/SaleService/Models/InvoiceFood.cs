using System;
using System.Collections.Generic;

namespace SaleService.Models;

public partial class InvoiceFood
{
    public int InvoiceId { get; set; }

    public int FoodId { get; set; }

    public int? Quantity { get; set; }

    public virtual Food Food { get; set; } = null!;

    public virtual Invoice Invoice { get; set; } = null!;
}
