using AuthenticationService.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationService.Repositories.CustomerRepositories
{
    public class CustomerRepo : ICustomerRepo
    {
        private readonly AuthenticateContext _context;

        public CustomerRepo(AuthenticateContext context)
        {
            _context = context;
        }
        public async Task CreateCustomerAsync(Customer customer)
        {
            await _context.Customers.AddAsync(customer);
        }

        public async Task UpdateCustomerAsync(Customer customer)
        {
            if (customer == null)
            {
                throw new ArgumentNullException(nameof(customer));
            }

            _context.Entry(customer).State = EntityState.Modified;

            await _context.SaveChangesAsync();
        }

        public async Task UpdatePassword(Customer customer)
        {
            _context.Customers.Update(customer);
        }
        public async Task<bool> SaveChangeAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}