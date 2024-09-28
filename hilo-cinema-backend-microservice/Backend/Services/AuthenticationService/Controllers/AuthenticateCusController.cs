using AuthenticationService.Data;
using AuthenticationService.Data.EmployeeData;
using AuthenticationService.Dtos;
using AuthenticationService.Dtos.Employee;
using AuthenticationService.Helper;
using AuthenticationService.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AuthenticationService.Controllers
{
    [ApiController]
    [Route("api/AuthenticationService")]
    public class AuthenticateCusController : ControllerBase
    {
        private readonly ICustomerRepository _repository;
        private readonly IEmployeeRepository _empRepository;

        public AuthenticateCusController(ICustomerRepository repository, IEmployeeRepository empRepository)
        {
            _repository = repository;
            _empRepository = empRepository;
        }

        [HttpPost("customer/register")]
        public async Task<IActionResult> Register(RegisterDTO model)
        {
            try
            {
                if (_repository.IsEmailExist(model.Email))
                    return BadRequest("Email already in use");

                var customer = new Customer
                {
                    Name = model.Name,
                    Email = model.Email,
                    Phone = model.Phone,
                    Gender = model.Gender,
                    Birthdate = model.Birthdate,
                    Password = PasswordHasher.HashPassword(model.Password),
                    Created_Date = DateTime.UtcNow
                };

                _repository.Register(customer);

                return Ok(new { message = "Register successfully" });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("employee/register")]
        public async Task<IActionResult> RegisterEmployee(RegisterEmployeeDTO model)
        {
            try
            {
                if (_empRepository.IsEmailExist(model.Email))
                    return BadRequest("Email already in use");

                var employee = new Employee
                {
                    Name = model.Name,
                    Email = model.Email,
                    Phone = model.Phone,
                    Address = model.Address,
                    Gender = model.Gender,
                    Birthdate = model.Birthdate,
                    Position = model.Position,
                    Sys_Role = model.Sys_Role,
                    Password = PasswordHasher.HashPassword(model.Password),
                    Created_Date = DateTime.UtcNow,
                    Status = model.Status
                };

                _empRepository.Register(employee);

                return Ok(new { message = "Register successfully" });
            }
            catch (Exception e)
            {
                var innerException = e.InnerException != null ? e.InnerException.Message : e.Message;
                return BadRequest($"Error occurred while registering employee: {innerException}");
            }
        }


        [HttpPost("customer/login")]
        public async Task<IActionResult> Authenticate(LoginDTO model)
        {
            var customer = await _repository.GetCustomerByEmail(model.Email);

            if (customer == null || !PasswordHasher.VerifyPassword(customer.Password, model.Password))
                return BadRequest(new { message = "Email hoặc mật khẩu không chính xác" });

            
            var token = _repository.GenerateJwtToken(customer);

            customer.Token = token;
            _repository.UpdateCustomer(customer);

            return Ok(new { token });
        }

        [HttpPost("employee/login")]
        public async Task<IActionResult> AuthenticateEmployee(LoginDTO model)
        {
            var employee = await _empRepository.GetEmployeeByEmail(model.Email);

            if (employee == null || !PasswordHasher.VerifyPassword(employee.Password, model.Password))
                return BadRequest(new { message = "Email hoặc mật khẩu không chính xác" });


            var token = _empRepository.GenerateJwtToken(employee);

            employee.Token = token;
            _empRepository.UpdateEmployee(employee);

            return Ok(new { token });
        }

        [HttpPost("customer/logout")]
        public async Task<IActionResult> LogoutCustomer(LogoutDTO model)
        {
            var customer = await _repository.GetCustomerByEmail(model.Email);

            if (customer == null)
                return BadRequest(new { message = "Invalid email" });

            // Invalidate the token
            _repository.InvalidateToken(customer);

            return Ok(new { message = "Logout successful" });
        }

        [HttpPost("employee/logout")]
        public async Task<IActionResult> LogoutEmployee(LogoutDTO model)
        {
            var employee = await _empRepository.GetEmployeeByEmail(model.Email);

            if (employee == null)
                return BadRequest(new { message = "Invalid email" });

            // Invalidate the token
            _empRepository.InvalidateToken(employee);

            return Ok(new { message = "Logout successful" });
        }
    }
}
