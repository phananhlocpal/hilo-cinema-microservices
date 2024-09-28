using System;
using System.Collections.Generic;

namespace MovieService.Models;

public partial class Movie
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string MovieUrl { get; set; } = null!;

    public int Duration { get; set; }

    public DateOnly? ReleasedDate { get; set; }

    public double? Rate { get; set; }

    public string? Country { get; set; }

    public string Director { get; set; } = null!;

    public string Description { get; set; } = null!;

    public byte[]? ImgSmall { get; set; }

    public byte[]? ImgLarge { get; set; }

    public string? MovieType { get; set; }

    public string? Trailer { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<Actor> Actors { get; set; } = new List<Actor>();

    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();

    public virtual ICollection<Producer> Producers { get; set; } = new List<Producer>();
}
