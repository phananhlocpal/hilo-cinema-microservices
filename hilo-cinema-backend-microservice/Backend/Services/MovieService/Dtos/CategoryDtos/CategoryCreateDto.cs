
using MovieService.Models;

namespace MovieService.Dtos.CategoryDtos
{
    public class CategoryCreateDto
    {
        public string? Name { get; set; }
        public string? Status { get; set; }

        public List<int> MovieIds { get; set; } = new List<int>();
    }
}
