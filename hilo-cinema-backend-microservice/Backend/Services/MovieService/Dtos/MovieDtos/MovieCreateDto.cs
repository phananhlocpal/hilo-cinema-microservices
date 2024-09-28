namespace MovieService.Dtos.MovieDtos
{
    public class MovieCreateDto
    {
        public string Title { get; set; }
        public string MovieUrl { get; set; }
        public int Duration { get; set; }
        public DateOnly? ReleasedDate { get; set; }
        public double? Rate { get; set; }
        public string? Country { get; set; }
        public string Director { get; set; }
        public string Description { get; set; }

        public IFormFile? ImgSmall { get; set; }  // Uploaded image file
        public IFormFile? ImgLarge { get; set; }  // Uploaded image file

        public string? MovieType { get; set; }
        public string? Trailer { get; set; }
        public string? Status { get; set; }
    }
}
