namespace TheaterService.Dtos
{
    public class RoomReadDto
    {
        public int Id { get; set; }
        public int TheaterId { get; set; }
        public string Name { get; set; } = null!;
        public int ColNum { get; set; }
        public int RowNum { get; set; }
        public string? Status { get; set; }
    }

    public class RoomCreateDto
    {
        public int TheaterId { get; set; }
        public string Name { get; set; } = null!;
        public int ColNum { get; set; }
        public int RowNum { get; set; }
        public string? Status { get; set; }
    }
}
