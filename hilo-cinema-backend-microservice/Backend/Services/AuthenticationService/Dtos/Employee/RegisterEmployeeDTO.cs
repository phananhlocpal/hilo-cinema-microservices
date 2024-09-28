namespace AuthenticationService.Dtos.Employee
{
    public class RegisterEmployeeDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Gender { get; set; }
        public DateTime Birthdate { get; set; }
        public string Password { get; set; }
        public string Position { get; set; }
        public string Sys_Role { get; set; }
        public DateTime Created_Date { get; set; }
        public string Status { get; set; }
    }
}
