using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace AuthenticationService.Models
{
    public class Customer
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
        [DataType(DataType.Date)]
        public DateTime Birthdate { get; set; }

        [Required]
        [StringLength(150, ErrorMessage = "Password length can't be more than 150.")]
        public string Password { get; set; }

        [StringLength(500, ErrorMessage = "Token length can't be more than 150.")]
        public string? Token { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Created_Date { get; set; }
    }
}
