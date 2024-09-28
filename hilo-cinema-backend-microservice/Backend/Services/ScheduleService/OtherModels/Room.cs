namespace ScheduleService.OtherModels
{
    public class Room
    {
        public int Id { get; set; }
        public int TheaterId { get; set; }
        public string Name { get; set; }
        public int ColNum { get; set; }
        public int RowNum { get; set; }
        public string? Status { get; set; }
        public Theater? Theater { get; set; }
    }
}
