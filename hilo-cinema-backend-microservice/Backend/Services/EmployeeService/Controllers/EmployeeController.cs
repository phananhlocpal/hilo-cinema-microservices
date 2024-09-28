using AutoMapper;
using EmployeeService.Dtos;
using EmployeeService.Models;
using EmployeeService.Repositories;
using EmployeeService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using EmployeeService.Helper;

namespace EmployeeService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepo _employeeRepo;
        private readonly IMapper _mapper;
        private readonly ILogger<EmployeeController> _logger;
        private readonly EmailService _emailService;
        private readonly EmployeePublisher _employeePublisher;
        public EmployeeController(IEmployeeRepo employeeRepo, IMapper mapper, ILogger<EmployeeController> logger, EmailService emailService, EmployeePublisher employeePublisher)
        {
            _employeeRepo = employeeRepo;
            _mapper = mapper;
            _logger = logger;
            _emailService = emailService;
            _employeePublisher = employeePublisher;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeReadDto>>> GetAllEmployees()
        {
            // Log the user's roles and claims
            var userRoles = User.Claims.Where(c => c.Type == "role").Select(c => c.Value);
            _logger.LogInformation("User Roles: " + string.Join(",", userRoles));

            try
            {
                var employees = await _employeeRepo.GetAllAsync();
                var employeeDtos = _mapper.Map<IEnumerable<EmployeeReadDto>>(employees);
                return Ok(employeeDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving employees.");
                return StatusCode(500, "Internal server error.");
            }
        }

        // Retrieve employee by ID
        [HttpGet("{id}", Name = "GetEmployeeById")]
        public async Task<ActionResult<EmployeeReadDto>> GetEmployeeById(int id)
        {
            try
            {
                var employee = await _employeeRepo.GetByIdAsync(id);
                if (employee == null)
                {
                    return NotFound();
                }

                var employeeDto = _mapper.Map<EmployeeReadDto>(employee);
                return Ok(employeeDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving employee with Id {id}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        // API to check if email exists
        [HttpPost("CheckEmail")]
        public async Task<ActionResult<bool>> CheckEmailExists([FromBody] string email)
        {
            if (await _employeeRepo.EmailExistsAsync(email))
            {
                return Ok(new { exists = true });
            }

            return Ok(new { exists = false });
        }

        // Create new employee
        [HttpPost]
        //[Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<EmployeeReadDto>> CreateEmployee(EmployeeCreateDto employeeCreateDto)
        {
            try
            {
                // Check if email already exists
                if (await _employeeRepo.EmailExistsAsync(employeeCreateDto.Email))
                {
                    return BadRequest("Email already exists.");
                }

                // Validate birthdate (must be 18 or older)
                if (!IsAdult(employeeCreateDto.Birthdate))
                {
                    return BadRequest("Employee must be at least 18 years old.");
                }

                // Validate phone number (must be 10 digits)
                if (string.IsNullOrEmpty(employeeCreateDto.Phone) || employeeCreateDto.Phone.Length != 10)
                {
                    return BadRequest("Phone number must be 10 digits.");
                }

                // Validate password
                if (!IsValidPassword(employeeCreateDto.Password))
                {
                    return BadRequest("Password must be at least 6 characters long, contain an uppercase letter and a special character.");
                }
                var plainTextPassword = employeeCreateDto.Password;
                // Hash the password
                employeeCreateDto.Password = PasswordHasher.HashPassword(employeeCreateDto.Password);
                employeeCreateDto.CreatedDate = DateOnly.FromDateTime(DateTime.Now);

                var employee = _mapper.Map<Employee>(employeeCreateDto);
                await _employeeRepo.CreateAsync(employee);
                var isSaved = await _employeeRepo.SaveChangesAsync();

                if (!isSaved)
                {
                    return StatusCode(500, "Error saving employee to database.");
                }

                // Gửi email chào mừng tới nhân viên mới
                await _emailService.WelcomeEmail(employee, plainTextPassword);

                // Publish the employee creation event to AuthenticationService
                _employeePublisher.PublishEmployeeCreation(employee);

                var employeeReadDto = _mapper.Map<EmployeeReadDto>(employee);
                return CreatedAtRoute(nameof(GetEmployeeById), new { id = employeeReadDto.Id }, employeeReadDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating employee.");
                return StatusCode(500, "Internal server error.");
            }
        }



        // Update employee details
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateEmployee(int id, EmployeeCreateDto employeeUpdateDto)
        {
            try
            {
                var existingEmployee = await _employeeRepo.GetByIdAsync(id);
                if (existingEmployee == null)
                {
                    return NotFound();
                }

                // Update password if provided, otherwise keep the existing one
                if (!string.IsNullOrEmpty(employeeUpdateDto.Password))
                {
                    existingEmployee.Password = PasswordHasher.HashPassword(employeeUpdateDto.Password);
                }

                // Map other fields (excluding Password if it's not provided)
                _mapper.Map(employeeUpdateDto, existingEmployee);

                if (string.IsNullOrEmpty(employeeUpdateDto.Password))
                {
                    existingEmployee.Password = existingEmployee.Password; // Keep the old password
                }

                await _employeeRepo.UpdateAsync(existingEmployee);
                var isSaved = await _employeeRepo.SaveChangesAsync();

                if (!isSaved)
                {
                    return StatusCode(500, "Error updating employee in database.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating employee with Id {id}.");
                return StatusCode(500, ex.Message);
            }
        }


        // Hide employee (soft delete)
        [HttpPut("{id}/disable")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> HideEmployee(int id)
        {
            try
            {
                var employee = await _employeeRepo.GetByIdAsync(id);
                if (employee == null)
                {
                    return NotFound();
                }

                await _employeeRepo.HideEmployeeAsync(id);
                var isSaved = await _employeeRepo.SaveChangesAsync();

                if (!isSaved)
                {
                    return StatusCode(500, "Error hiding employee in database.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error hiding employee with Id {id}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        // Method to check if the employee is an adult
        private bool IsAdult(DateOnly? birthdate)
        {
            if (birthdate == null)
            {
                return false;
            }

            var today = DateOnly.FromDateTime(DateTime.Today);
            int age = today.Year - birthdate.Value.Year;
            if (birthdate.Value > today.AddYears(-age)) age--;
            return age >= 18;
        }


        // Method to validate password
        private bool IsValidPassword(string password)
        {
            if (password.Length < 6)
                return false;

            bool hasUpperCase = password.Any(char.IsUpper);
            bool hasSpecialChar = password.Any(ch => !char.IsLetterOrDigit(ch));

            return hasUpperCase && hasSpecialChar;
        }
        [HttpGet("count")]
        [AllowAnonymous]
        public async Task<ActionResult<int>> GetEmployeeCount()
        {
            try
            {
                var count = await _employeeRepo.GetEmployeeCountAsync();
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving employee count.");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
