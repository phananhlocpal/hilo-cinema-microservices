using System;
using System.Collections.Generic;

namespace AuthenticationService.Models;

public partial class Customer
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Address { get; set; }

    public string Phone { get; set; } = null!;

    public string? Gender { get; set; }

    public DateOnly? Birthdate { get; set; }

    public string? Password { get; set; }

    public string? Token { get; set; }

    public DateOnly? CreatedDate { get; set; }

    public string? Status { get; set; }
}
