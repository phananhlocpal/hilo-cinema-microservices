using ScheduleService.OtherModels;

namespace ScheduleService.Dtos
{
    public class ScheduleReadDto
    {
        public int MovieId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public int SeatId { get; set; }
        public int? InvoiceId { get; set; }
        public Movie? Movie { get; set; }
        public Seat? Seat { get; set; }
        public Invoice? Invoice { get; set; }


    }
}
