using EmployeeService.Models;

namespace EmployeeService.Repositories
{
    public interface IEmployeeRepo
    {
        Task<IEnumerable<Employee>> GetAllAsync();
        Task<Employee> GetByIdAsync(int id);
        Task CreateAsync(Employee employee);
        Task UpdateAsync(Employee employee);
        Task<bool> SaveChangesAsync();
        Task HideEmployeeAsync(int id);
        Task<bool> EmailExistsAsync(string email);
        Task<int> GetEmployeeCountAsync();
    }
}
