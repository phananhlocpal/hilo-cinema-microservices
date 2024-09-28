using SaleService.Models;

namespace SaleService.ViewModels
{
    public class InvoiceRequestModel
    {
        public DateOnly CreatedDate { get; set; }

        public int EmployeeId { get; set; }

        public int CustomerId { get; set; }

        public int? PromotionId { get; set; }

        public string? PaymentMethod { get; set; }

        public float? Total { get; set; }

        public List<int> SeatIds { get; set; }

        public List<FoodRequestModel>? FoodRequests { get; set; }

        public ScheduleRequest Schedule { get; set; }
    }

    public class FoodRequestModel
    {
        public int FoodId { get; set; }
        public int Quantity { get; set; }
    }

    public class ScheduleRequest
    {
        public int MovieId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
    }

}
