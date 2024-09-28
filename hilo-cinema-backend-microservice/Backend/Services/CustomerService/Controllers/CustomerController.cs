using AutoMapper;
using CustomerService.Data;
using CustomerService.Dtos;
using CustomerService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using CustomerService.Services;
using CustomerService.Helper;

namespace CustomerService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _repository;
        private readonly IMapper _mapper;
        private readonly CustomerPublisher _customerPublisher;
        private readonly CustomerEmailService _customerEmailService;
        private readonly ILogger<CustomerController> _logger;

        public CustomerController(
            ICustomerRepository repository,
            IMapper mapper,
            CustomerPublisher customerPublisher,
            CustomerEmailService customerEmailService,
            ILogger<CustomerController> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _customerPublisher = customerPublisher;
            _customerEmailService = customerEmailService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CustomerReadDTO>>> GetAllCustomers()
        {
            try
            {
                var customers = await _repository.GetAllCustomersAsync();
                if (!customers.Any())
                {
                    return NotFound("Customer list is empty");
                }
                return Ok(_mapper.Map<IEnumerable<CustomerReadDTO>>(customers));
            }
            catch (IOException e)
            {
                _logger.LogError(e, "An error occurred while getting all customers");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("count")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllCount()
        {
            try
            {
                var count = await _repository.GetAllCount();
                return Ok(count);
            }
            catch (IOException e)
            {
                _logger.LogError(e, "An error occurred while getting the customer count");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CustomerReadDTO>> GetCustomerById(int id)
        {
            try
            {
                var customer = await _repository.GetCustomerByIdAsync(id);
                if (customer == null)
                {
                    return NotFound($"Customer with ID {id} not found");
                }
                return Ok(_mapper.Map<CustomerReadDTO>(customer));
            }
            catch (IOException e)
            {
                _logger.LogError(e, "An error occurred while getting the customer by ID");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("email/{email}")]
        [AllowAnonymous]
        public async Task<ActionResult<CustomerReadDTO>> GetCustomerByEmail(string email)
        {
            try
            {
                var customer = await _repository.GetCustomerByEmailAsync(email);
                if (customer == null)
                {
                    return NotFound($"Customer with email {email} not found");
                }
                return Ok(_mapper.Map<CustomerReadDTO>(customer));
            }
            catch (IOException e)
            {
                _logger.LogError(e, "An error occurred while getting the customer by email");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("phone/{phone}")]
        [AllowAnonymous]
        public async Task<ActionResult<CustomerReadDTO>> GetCustomerByPhone(string phone)
        {
            try
            {
                var customer = await _repository.GetCustomerPhoneAsync(phone);
                if (customer == null)
                {
                    return NotFound($"Customer with phone number {phone} not found");
                }
                return Ok(_mapper.Map<CustomerReadDTO>(customer));
            }
            catch (IOException e)
            {
                _logger.LogError(e, "An error occurred while getting the customer by phone");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> CreateCustomer(CustomerCreateDTO customerCreateDto)
        {
            try
            {
                // Hash the password
                customerCreateDto.Password = PasswordHasher.HashPassword(customerCreateDto.Password);
                customerCreateDto.CreatedDate = DateOnly.FromDateTime(DateTime.Now);
                var customerModel = _mapper.Map<Customer>(customerCreateDto);
                await _repository.CreateCustomerAsync(customerModel);
                await _repository.SaveChangeAsync();

                _customerPublisher.CreateCustomerPubSub(customerModel);
                _customerEmailService.WelcomeEmail(customerModel);

                var customerReadDto = _mapper.Map<CustomerReadDTO>(customerModel);

                return CreatedAtAction(nameof(GetCustomerById), new { id = customerReadDto.Id }, customerReadDto);
            }
            catch (IOException e)
            {
                _logger.LogError(e, "An error occurred while creating the customer");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPut("{customerId}")]
        [AllowAnonymous]
        public async Task<ActionResult> UpdateCustomer(int customerId, [FromBody] CustomerCreateDTO customerDto)
        {
            try
            {
                // Retrieve the existing customer from the repository
                var existingCustomer = await _repository.GetCustomerByIdAsync(customerId);
                if (existingCustomer == null)
                {
                    return NotFound("Customer not found");
                }

                // Update password if provided, otherwise keep the existing one
                if (!string.IsNullOrEmpty(customerDto.Password))
                {
                    customerDto.Password = PasswordHasher.HashPassword(customerDto.Password);
                }
                else
                {
                    // Preserve the existing password if a new one is not provided
                    customerDto.Password = existingCustomer.Password;
                }

                // Map the incoming DTO to the existing entity
                _mapper.Map(customerDto, existingCustomer);

                // Save changes to the repository
                await _repository.UpdateCustomerAsync(existingCustomer);
                await _repository.SaveChangeAsync();

                _customerPublisher.UpdateCustomerPubSub(existingCustomer);

                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Customer not found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating the customer");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{customerId}/disable")]
        [Authorize]
        public async Task<ActionResult> DisableCustomer(int customerId)
        {
            if (customerId == null)
            {
                return BadRequest("Invalid customer data");
            }

            try
            {
                await _repository.DisableCustomerAsync(customerId);
                await _repository.SaveChangeAsync();
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Customer not found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating the customer");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("CheckEmail")]
        [AllowAnonymous]
        public async Task<ActionResult<bool>> CheckEmailExists([FromBody] string email)
        {
            if (await _repository.EmailExistsAsync(email))
            {
                return Ok(new { exists = true });
            }

            return Ok(new { exists = false });
        }
    }
}
