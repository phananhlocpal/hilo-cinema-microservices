using System;
using System.Collections.Generic;

namespace BlogService.Models;

public partial class Blog
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? Content { get; set; }

    public DateOnly? CreatedDate { get; set; }

    public int? EmployeeId { get; set; }

    public byte[]? Img { get; set; }

    public string? Status { get; set; }

    public string? Type { get; set; }
}
