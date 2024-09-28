using AuthenticationService.Models;

namespace AuthenticationService.Repositories.CustomerRepositories
{
    public interface ICustomerRepo
    {
        Task CreateCustomerAsync(Customer customer);
        Task UpdatePassword(Customer customer);
        Task UpdateCustomerAsync(Customer customer);
        Task<bool> SaveChangeAsync();
    }
}