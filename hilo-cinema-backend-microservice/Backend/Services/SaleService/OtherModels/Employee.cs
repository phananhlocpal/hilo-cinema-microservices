using System.ComponentModel.DataAnnotations;

namespace SaleService.OtherModels
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Gender { get; set; }
        public DateTime Birthdate { get; set; }
        public string Password { get; set; }
        public DateTime Created_Date { get; set; }
    }
}
