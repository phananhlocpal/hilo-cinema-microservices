using System;
using System.Collections.Generic;

namespace EmployeeService.Models;

public partial class Employee
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Address { get; set; }

    public string Phone { get; set; } = null!;

    public string? Gender { get; set; }

    public DateOnly? Birthdate { get; set; }

    public string? Password { get; set; }

    public string? Position { get; set; }

    public string? SysRole { get; set; }

    public DateOnly? CreatedDate { get; set; }

    public string? Status { get; set; }
}
