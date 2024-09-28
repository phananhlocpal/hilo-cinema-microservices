using AuthenticationService.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using System.Security.Authentication;

namespace AuthenticationService.Repositories
{
    public class JwtTokenHandlerEmp
    {
        public const string JWT_SECURITY_KEY = "yPkCqn4kSWLtaJwXvN2jGzQRyTZ3gdXkt7FeBJP";
        private const int JWT_TOKEN_VALIDITY_MINS = 120;
        private readonly AuthenticateContext _context;

        public JwtTokenHandlerEmp(AuthenticateContext context)
        {
            _context = context;
        }

        public AuthenticationEmpResponse? GenerateJwtToken(AuthenticationEmpRequest authenticationRequest)
        {
            if (string.IsNullOrWhiteSpace(authenticationRequest.Email) ||
                string.IsNullOrWhiteSpace(authenticationRequest.Password))
            {
                throw new AuthenticationException("Email and Password are required.");
            }

            var userAccount = _context.Employees
    .FirstOrDefault(x => x.Email == authenticationRequest.Email);

            if (userAccount == null)
            {
                throw new AuthenticationException("Invalid email or password.");
            }

            // Kiểm tra mật khẩu
            if (!BCrypt.Net.BCrypt.Verify(authenticationRequest.Password, userAccount.Password))
            {
                throw new AuthenticationException("Invalid email or password.");
            }


            var tokenExpiryTimeStamp = DateTime.Now.AddMinutes(JWT_TOKEN_VALIDITY_MINS);
            var tokenKey = Encoding.ASCII.GetBytes(JWT_SECURITY_KEY);
            var claimsIdentity = new ClaimsIdentity(new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, authenticationRequest.Email),
        new Claim("Site", userAccount.SysRole), // Thêm claim Site thay vì Role
         new Claim("Role", userAccount.SysRole)
    });


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

            return new AuthenticationEmpResponse
            {
                JwtToken = token,
                ExpiresIn = (int)tokenExpiryTimeStamp.Subtract(DateTime.Now).TotalSeconds,
                SysRole = userAccount.SysRole,
                Employee = userAccount
            };
        }

    }
}
