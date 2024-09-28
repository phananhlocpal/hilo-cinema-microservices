
﻿using MovieService.Models;

namespace MovieService.Dtos.ActorDtos
{
    public class ActorCreateDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public IFormFile? Img { get; set; } // This will handle the image upload
        public string? Status { get; set; }
        public List<int> MovieIds { get; set; } = new List<int>();
    }
}
