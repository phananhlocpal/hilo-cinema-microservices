using CustomerService.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerService.Data
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly CustomerContext _context;

        public CustomerRepository(CustomerContext context)
        {
            _context = context;
        }

        public async Task CreateCustomerAsync(Customer customer)
        {
            await _context.Customers.AddAsync(customer);
        }

        public async Task<int> GetAllCount()
        {
            return await _context.Customers.CountAsync();
        }

        public async Task<IEnumerable<Customer>> GetAllCustomersAsync()
        {
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer> GetCustomerByEmailAsync(string email)
        {
            return await _context.Customers.SingleOrDefaultAsync(c => c.Email == email);
        }

        public async Task<Customer> GetCustomerByIdAsync(int id)
        {
            return await _context.Customers.FindAsync(id);
        }

        public async Task<Customer> GetCustomerPhoneAsync(string phone)
        {
            return await _context.Customers.SingleOrDefaultAsync(c => c.Phone == phone);
        }

        public async Task<bool> SaveChangeAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        public async Task UpdateCustomerAsync(Customer customer)
        {
            if (customer == null)
            {
                throw new ArgumentNullException(nameof(customer));
            }

            _context.Entry(customer).State = EntityState.Modified;
        }

        public async Task DisableCustomerAsync(int customerId)
        {
            var customer = await _context.Customers.FindAsync(customerId);
            if (customer != null)
            {
                customer.Status = "Inactive";
                await _context.SaveChangesAsync();
            }
        }
        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Customers.AnyAsync(e => e.Email == email);
        }
    }
}
