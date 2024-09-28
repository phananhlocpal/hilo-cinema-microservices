using System;
using System.Collections.Generic;

namespace ScheduleService.Models;

public partial class Schedule
{
    public int MovieId { get; set; }

    public DateOnly Date { get; set; }

    public TimeOnly Time { get; set; }

    public int SeatId { get; set; }

    public int? InvoiceId { get; set; }
}
