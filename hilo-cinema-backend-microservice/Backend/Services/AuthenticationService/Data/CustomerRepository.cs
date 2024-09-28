using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthenticationService.Dtos;
using AuthenticationService.Helper;
using AuthenticationService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AuthenticationService.Data
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly AuthenticateDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public CustomerRepository(AuthenticateDbContext context, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
        }

        public bool IsEmailExist(string email)
        {
            return _context.Customer.Any(c => c.Email == email);
        }

        public void Register(Customer customer)
        {
            _context.Customer.Add(customer);
            _context.SaveChanges();
        }

        public async Task<Customer> GetCustomerByEmail(string email)
        {
            var customer = await _context.Customer.SingleOrDefaultAsync(c => c.Email == email);
            if (customer == null)
            {
                throw new Exception("Customer not found");
            }
            return customer;
        }

        public string GenerateJwtToken(Customer customer)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", customer.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public void UpdateCustomer(Customer customer)
        {
            _context.Customer.Update(customer);
            _context.SaveChanges();
        }

        public string Login(LoginDTO loginDTO)
        {
            var user = _context.Customer.SingleOrDefault(x => x.Email == loginDTO.Email);

            // return null if user not found or password is incorrect
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password)) return null;

            var token = GenerateJwtToken(user);

            // Update customer with new token
            user.Token = token;
            UpdateCustomer(user);

            return token;
        }

        public Customer GetById(int id)
        {
            return _context.Customer.FirstOrDefault(x => x.Id == id);
        }

        public void SaveChangesAsync()
        {
            _context.SaveChanges();
        }
        public void InvalidateToken(Customer customer)
        {
            customer.Token = null;
            UpdateCustomer(customer);
        }
    }
}
