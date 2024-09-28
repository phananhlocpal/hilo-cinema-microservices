namespace SaleService.Dtos
{
    public class FoodCreateDto
    {
        public string Name { get; set; } = null!;
        public double? CostPrice { get; set; }
        public double? Price { get; set; }
        public double? Profit { get; set; }
        public int? Stock { get; set; }
        public string? Img { get; set; }
        public string? Status { get; set; }
    }
}
