using AuthenticationService.Dtos;
using AuthenticationService.Helper;
using AuthenticationService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthenticationService.Data.EmployeeData
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AuthenticateDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public EmployeeRepository(AuthenticateDbContext context, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
        }
        public bool IsEmailExist(string email)
        {
            return _context.Employee.Any(c => c.Email == email);
        }

        public void Register(Employee employee)
        {
            _context.Employee.Add(employee);
            _context.SaveChanges();
        }

        public async Task<Employee> GetEmployeeByEmail(string email)
        {
            var employee = await _context.Employee.SingleOrDefaultAsync(c => c.Email == email);
            if (employee == null)
            {
                throw new Exception("Employee not found");
            }
            return employee;
        }

        public string GenerateJwtToken(Employee employee)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", employee.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public void UpdateEmployee(Employee employee)
        {
            _context.Employee.Update(employee);
            _context.SaveChanges();
        }

        public string Login(LoginDTO loginDTO)
        {
            var employee = _context.Employee.SingleOrDefault(x => x.Email == loginDTO.Email);

            // return null if user not found or password is incorrect
            if (employee == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Password, employee.Password)) return null;

            var token = GenerateJwtToken(employee);

            // Update customer with new token
            employee.Token = token;
            UpdateEmployee(employee);

            return token;
        }

        public Employee GetById(int id)
        {
            return _context.Employee.FirstOrDefault(x => x.Id == id);
        }

        public void SaveChangesAsync()
        {
            _context.SaveChanges();
        }
        public void InvalidateToken(Employee employee)
        {
            employee.Token = null;
            UpdateEmployee(employee);
        }
    }
}
