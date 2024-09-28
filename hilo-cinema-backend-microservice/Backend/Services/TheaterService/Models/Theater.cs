using System;
using System.Collections.Generic;

namespace TheaterService.Models;

public partial class Theater
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? City { get; set; }

    public string? DetailAddress { get; set; }

    public string? Hotline { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}
