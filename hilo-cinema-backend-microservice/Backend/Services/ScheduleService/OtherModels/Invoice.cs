namespace ScheduleService.OtherModels
{
    public class Invoice
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }

        public int CustomerId { get; set; }

        public int? PromotionId { get; set; }

        public string? PaymentMethod { get; set; }

        public int? Total { get; set; }

        public string? Status { get; set; }
    }
}
