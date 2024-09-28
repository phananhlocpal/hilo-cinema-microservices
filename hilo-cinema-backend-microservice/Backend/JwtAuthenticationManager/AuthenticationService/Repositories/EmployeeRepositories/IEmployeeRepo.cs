using AuthenticationService.Models;

namespace AuthenticationService.Repositories.EmployeeRepositories
{
    public interface IEmployeeRepo
    {
        Task CreateEmployeeAsync(Employee employee);
        Task UpdatePassword(Employee employee);
        Task<bool> EmployeeExistsByEmailAsync(string email);
        Task<bool> SaveChangeAsync();
    }
}
