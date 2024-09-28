using System;
using System.Collections.Generic;

namespace MovieService.Models;

public partial class Category
{
    public int Id { get; set; }

    public string? Name { get; set; }
    public string? Status { get; set; }

    public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
