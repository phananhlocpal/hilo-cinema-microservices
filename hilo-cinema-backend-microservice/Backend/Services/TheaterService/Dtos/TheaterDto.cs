using System.ComponentModel.DataAnnotations;

namespace TheaterService.Dtos
{
    public class TheaterCreateDto
    {
        public string Name { get; set; } = null!;

        public string? City { get; set; }

        public string? DetailAddress { get; set; }

        public string? Hotline { get; set; }

        public string? Status { get; set; }
    }

    public class TheaterReadDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string? City { get; set; }

        public string? DetailAddress { get; set; }

        public string? Hotline { get; set; }

        public string? Status { get; set; }
    }
}
