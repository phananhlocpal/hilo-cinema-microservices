namespace ScheduleService.Dtos
{
    public class ScheduleCreateDto
    {
        public int MovieId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public List<int> SeatIds { get; set; }
        public int? InvoiceId { get; set; }
    }
}
