using System.ComponentModel.DataAnnotations;

namespace AuthenticationService.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(30, ErrorMessage = "Name length can't be more than 30.")]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(30, ErrorMessage = "Email length can't be more than 30.")]
        public string Email { get; set; }

        [Required]
        [Phone]
        [StringLength(10, ErrorMessage = "Phone length can't be more than 10.")]
        public string Phone { get; set; }

        [Required]
        [StringLength(6, ErrorMessage = "Gender length can't be more than 6.")]
        public string Gender { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Address length can't be more than 100.")]
        public string Address { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Birthdate { get; set; }

        [Required]
        [StringLength(150, ErrorMessage = "Password length can't be more than 100.")]

        public string Password { get; set; }

        [Required]
        [StringLength(30, ErrorMessage = "Position length can't be more than 150.")]
        public string Position { get; set; }

        [Required]
        [StringLength(30, ErrorMessage = "System Role length can't be more than 30.")]
        public string Sys_Role { get; set; }


        [StringLength(500, ErrorMessage = "Token length can't be more than 150.")]
        public string? Token { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Created_Date { get; set; }
        [Required]
        public string Status { get; set; }
    }
}
