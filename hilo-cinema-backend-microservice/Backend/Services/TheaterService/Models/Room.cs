using System;
using System.Collections.Generic;

namespace TheaterService.Models;

public partial class Room
{
    public int Id { get; set; }

    public int TheaterId { get; set; }

    public string Name { get; set; } = null!;

    public int ColNum { get; set; }

    public int RowNum { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();

    public virtual Theater Theater { get; set; } = null!;
}
