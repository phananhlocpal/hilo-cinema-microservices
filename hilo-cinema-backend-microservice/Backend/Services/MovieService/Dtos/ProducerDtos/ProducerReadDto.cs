using MovieService.Models;

namespace MovieService.Dtos.ProducerDtos
{
    public class ProducerReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? ImgBase64 => Img != null ? Convert.ToBase64String(Img) : null;
        public string? Status { get; set; }
        public byte[]? Img { get; set; } // This stores the image as a byte array
        public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
    }
}
