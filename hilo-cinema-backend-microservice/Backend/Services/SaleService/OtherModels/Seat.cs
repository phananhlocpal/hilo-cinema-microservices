namespace SaleService.OtherModels
{
    public class Seat
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public int ColSeat { get; set; }
        public int RowSeat { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? Status { get; set; }
        public Room? Room { get; set; }
    }
}
