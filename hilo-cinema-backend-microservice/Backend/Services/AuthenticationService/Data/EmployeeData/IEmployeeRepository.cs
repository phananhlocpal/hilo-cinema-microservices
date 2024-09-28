using AuthenticationService.Dtos;
using AuthenticationService.Dtos.Employee;
using AuthenticationService.Models;

namespace AuthenticationService.Data.EmployeeData
{
    public interface IEmployeeRepository
    {
        bool IsEmailExist(string email);
        void Register(Employee employee);
        Task<Employee> GetEmployeeByEmail(string email);
        string Login(LoginDTO loginDTO);
        Employee GetById(int id);
        string GenerateJwtToken(Employee employee);
        void UpdateEmployee(Employee employee);
        void InvalidateToken(Employee employee);
        void SaveChangesAsync();
    }
}
