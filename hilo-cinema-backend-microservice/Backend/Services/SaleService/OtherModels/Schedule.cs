namespace SaleService.OtherModels
{
    public class Schedule
    {
        public int MovieId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public int SeatId { get; set; }
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int CustomerId { get; set; }
        public int? PromotionId { get; set; }
        public string? PaymentMethod { get; set; }
        public int? Total { get; set; }
        public string? Status { get; set; }
        public Seat? Seat { get; set; }
    }
}
