using AuthenticationService.Dtos;
using AuthenticationService.Models;

namespace AuthenticationService.Data
{
    public interface ICustomerRepository
    {
        bool IsEmailExist(string email);
        void Register(Customer customer);
        Task<Customer> GetCustomerByEmail(string email);
        string Login(LoginDTO loginDTO);
        Customer GetById(int id);
        string GenerateJwtToken(Customer customer);
        void UpdateCustomer(Customer customer);
        void InvalidateToken(Customer customer);
        void SaveChangesAsync();
    }
}
