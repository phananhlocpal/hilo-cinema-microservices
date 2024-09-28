using AuthenticationService.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationService.Repositories.EmployeeRepositories
{
    public class EmployeeRepo : IEmployeeRepo
    {
        private readonly AuthenticateContext _context;

        public EmployeeRepo(AuthenticateContext context)
        {
            _context = context;
        }

        public async Task CreateEmployeeAsync(Employee employee)
        {
            // Hash the password before saving
            await _context.Employees.AddAsync(employee);
        }
        public async Task<bool> EmployeeExistsByEmailAsync(string email)
        {
            return await _context.Employees.AnyAsync(e => e.Email == email);
        }
        public async Task UpdatePassword(Employee employee)
        {
            // Hash the new password before saving
            employee.Password = BCrypt.Net.BCrypt.HashPassword(employee.Password);
            _context.Employees.Update(employee);
        }

        public async Task<bool> SaveChangeAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
