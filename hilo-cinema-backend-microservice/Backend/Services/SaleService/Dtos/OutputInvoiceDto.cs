using SaleService.OtherModels;

namespace SaleService.Dtos
{
    public class OutputInvoiceDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerEmail { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public DateOnly CreatedDate { get; set; }
        public Movie Movie { get; set; }
        public int TheaterId { get; set; }
        public string TheaterName { get; set; }
        public int RoomId { get; set; }
        public string RoomName { get; set; }
        public List<Seat> Seats { get; set; }
        public List<Food> Foods { get; set; }
        public int? PromotionId { get; set; }
        public string? PaymentMethod { get; set; }
        public double? Total { get; set; }
        public string? Status { get; set; }

    }

    public class Food
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
    }
}
