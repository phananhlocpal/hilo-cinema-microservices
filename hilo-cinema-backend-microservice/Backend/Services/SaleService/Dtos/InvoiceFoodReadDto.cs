namespace SaleService.Dtos
{
    public class InvoiceFoodReadDto
    {
        public int FoodId { get; set; }
        public int? Quantity { get; set; }
        public FoodReadDto Food { get; set; } = new FoodReadDto();
    }
}
