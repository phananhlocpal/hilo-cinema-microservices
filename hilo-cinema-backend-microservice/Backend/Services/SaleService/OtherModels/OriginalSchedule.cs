namespace SaleService.OtherModels
{
    public class OriginalSchedule
    {
        public int MovieId { get; set; }

        public DateOnly Date { get; set; }

        public TimeOnly Time { get; set; }

        public int SeatId { get; set; }

        public int? InvoiceId { get; set; }
    }
}
