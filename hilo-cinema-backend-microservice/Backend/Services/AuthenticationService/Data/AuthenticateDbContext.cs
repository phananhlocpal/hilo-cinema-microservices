using AuthenticationService.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationService.Data
{
    public class AuthenticateDbContext : DbContext
    {
        public AuthenticateDbContext(DbContextOptions<AuthenticateDbContext> options) : base(options)
        {
        }

        public virtual DbSet<Customer> Customer { get; set; }
        public virtual DbSet<Employee> Employee { get; set; }
    }
}
