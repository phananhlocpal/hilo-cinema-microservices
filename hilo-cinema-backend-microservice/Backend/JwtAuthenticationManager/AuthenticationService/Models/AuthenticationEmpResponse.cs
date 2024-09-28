namespace AuthenticationService.Models
{
    public class AuthenticationEmpResponse
    {
        public string JwtToken { get; set; }
        public int ExpiresIn { get; set; }
        public string SysRole { get; set; }
        public Employee Employee { get; set; }
    }
}
