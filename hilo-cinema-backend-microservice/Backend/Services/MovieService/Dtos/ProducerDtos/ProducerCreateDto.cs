using MovieService.Models;

namespace MovieService.Dtos.ProducerDtos
{
    public class ProducerCreateDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public IFormFile? Img { get; set; } // This will handle the image upload
        public string? Status { get; set; }
        public List<int> MovieIds { get; set; } = new List<int>();
    }
}
