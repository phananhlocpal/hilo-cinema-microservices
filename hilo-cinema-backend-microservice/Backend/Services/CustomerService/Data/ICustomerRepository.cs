using CustomerService.Models;

namespace CustomerService.Data
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<Customer>> GetAllCustomersAsync();
        Task<Customer> GetCustomerByEmailAsync(string email);
        Task<Customer> GetCustomerPhoneAsync(string phone);
        Task<Customer> GetCustomerByIdAsync(int id);
        Task CreateCustomerAsync(Customer customer);
        Task UpdateCustomerAsync(Customer customer);
        Task DisableCustomerAsync(int customerId);
        Task<bool> EmailExistsAsync(string email);
        Task<int> GetAllCount();
        Task<bool> SaveChangeAsync();
    }
}
