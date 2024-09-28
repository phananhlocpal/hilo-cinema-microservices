using AuthenticationService.Models;
using AuthenticationService.Repositories.EmployeeRepositories;
using JwtAuthenticationManager.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace AuthenticationService.Repositories
{
    public class JwtTokenHandler
    {
        public const string JWT_SECURITY_KEY = "yPkCqn4kSWLtaJwXvN2jGzQRyTZ3gdXkt7FeBJP";
        private const int JWT_TOKEN_VALIDITY_MINS = 120;
        private readonly AuthenticateContext _context;

        public JwtTokenHandler(AuthenticateContext context)
        {
            _context = context;
        }

        public AuthenticationResponse? GenerateJwtToken(AuthenticationRequest authenticationRequest)
        {
            if (string.IsNullOrWhiteSpace(authenticationRequest.Email) ||
                string.IsNullOrWhiteSpace(authenticationRequest.Password) ||
                string.IsNullOrWhiteSpace(authenticationRequest.Site))
            {
                return null;
            }

            object userAccount = null;

            // Fetch data based on site value
            if (authenticationRequest.Site == "admin")
            {
                var adminEmployee = _context.Employees.FirstOrDefault(x =>
                    x.Email == authenticationRequest.Email);

                if (adminEmployee != null && BCrypt.Net.BCrypt.Verify(authenticationRequest.Password, adminEmployee.Password))
                {
                    userAccount = adminEmployee;
                }
            }
            else if (authenticationRequest.Site == "public")
            {
                var publicCustomer = _context.Customers.FirstOrDefault(x =>
                    x.Email == authenticationRequest.Email);

                if (publicCustomer != null && BCrypt.Net.BCrypt.Verify(authenticationRequest.Password, publicCustomer.Password))
                {
                    userAccount = publicCustomer;
                }
            }

            if (userAccount == null)
            {
                return null;
            }

            var tokenExpiryTimeStamp = DateTime.Now.AddMinutes(JWT_TOKEN_VALIDITY_MINS);
            var tokenKey = Encoding.ASCII.GetBytes(JWT_SECURITY_KEY);
            var claimsIdentity = new ClaimsIdentity(new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, authenticationRequest.Email),
                new Claim("Site", authenticationRequest.Site)
            });

            // Add role claim based on the type of user
            if (userAccount is Models.Employee employee)
            {
                claimsIdentity.AddClaim(new Claim("Role", employee.SysRole));
            }
            else if (userAccount is Customer customer)
            {
                claimsIdentity.AddClaim(new Claim("Role", "customer"));
            }

            var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(tokenKey),
                SecurityAlgorithms.HmacSha256Signature
            );

            var securityTokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claimsIdentity,
                Expires = tokenExpiryTimeStamp,
                SigningCredentials = signingCredentials,
            };

            var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            var securityToken = jwtSecurityTokenHandler.CreateToken(securityTokenDescriptor);
            var token = jwtSecurityTokenHandler.WriteToken(securityToken);

            return new AuthenticationResponse
            {
                Account = userAccount,
                ExpiresIn = (int)tokenExpiryTimeStamp.Subtract(DateTime.Now).TotalSeconds,
                JwtToken = token,
            };
        }
    }
}