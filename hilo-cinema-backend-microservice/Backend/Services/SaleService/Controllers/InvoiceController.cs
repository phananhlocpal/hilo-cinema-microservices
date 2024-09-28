using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SaleService.Dtos;
using SaleService.Models;
using SaleService.OtherModels;
using SaleService.Repositories.FoodRepository;
using SaleService.Repositories.InvoiceFoodRepository;
using SaleService.Repositories.InvoiceRepository;
using SaleService.Service.RabbitMQServices;
using SaleService.Services.HttpServices;
using SaleService.ViewModels;
using System.Text.Json;


namespace SaleService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceRepo _repository;
        private readonly IInvoiceFoodRepo _invoiceFoodRepo;
        private readonly IFoodRepo _foodRepo;
        private readonly IMapper _mapper;
        private readonly ScheduleHttpService _scheduleHttpService;
        private readonly CustomerHttpService _customerHttpService;
        private readonly EmployeeHttpService _employeeHttpService;
        private readonly SalePublisherService _salePublisherService;
        private readonly MovieHttpService _movieHttpService;
        private readonly TheaterHttpService _theaterHttpService;
        private readonly ILogger<InvoiceController> _logger;

        public InvoiceController(
             IInvoiceRepo repository,
             IInvoiceFoodRepo invoiceFoodRepo,
             IFoodRepo foodRepo,
             IMapper mapper,
             ScheduleHttpService scheduleHttpService,
             CustomerHttpService customerHttpService,
             EmployeeHttpService employeeHttpService,
             SalePublisherService salePublisherService,
             MovieHttpService movieHttpService,
             TheaterHttpService theaterHttpService,
             ILogger<InvoiceController> logger)
        {
            _repository = repository;
            _invoiceFoodRepo = invoiceFoodRepo;
            _foodRepo = foodRepo;
            _mapper = mapper;
            _scheduleHttpService = scheduleHttpService;
            _customerHttpService = customerHttpService;
            _employeeHttpService = employeeHttpService;
            _salePublisherService = salePublisherService;
            _movieHttpService = movieHttpService;
            _theaterHttpService = theaterHttpService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<InvoiceReadDto>>> GetAllInvoices()
        {
            var invoices = await _repository.GetAllInvoiceAsync();

            var invoiceReadDtos = new List<InvoiceReadDto>();

            foreach (var invoice in invoices)
            {
                // Start all tasks concurrently
                var scheduleTask = _scheduleHttpService.GetScheduleByInvoiceId(invoice.Id);
                var customerTask = _customerHttpService.GetCustomerById(invoice.CustomerId);
                var employeeTask = _employeeHttpService.GetEmployeeById(invoice.EmployeeId);

                // Wait for all tasks to complete
                await Task.WhenAll(scheduleTask, customerTask, employeeTask);

                var schedules = await scheduleTask;
                var customer = await customerTask;
                var employee = await employeeTask;

                // Check if customer and employee are not null before proceeding
                if (customer == null || employee == null)
                {
                    _logger.LogWarning($"Customer or Employee not found for InvoiceId: {invoice.Id}");
                    continue;  // Skip this invoice if related entities are not found
                }

                var invoiceReadDto = new InvoiceReadDto
                {
                    Id = invoice.Id,
                    EmployeeId = invoice.EmployeeId,
                    CustomerId = invoice.CustomerId,
                    PromotionId = invoice.PromotionId,
                    CreatedDate = invoice.CreatedDate,
                    PaymentMethod = invoice.PaymentMethod,
                    Total = invoice.Total,
                    Status = invoice.Status,
                    Schedules = schedules,
                    Customer = customer,
                    Employee = employee,
                };

                invoiceReadDtos.Add(invoiceReadDto);
            }

            return Ok(invoiceReadDtos);
        }

        [HttpGet("GetInvoiceById/{invoiceId}")]
        [AllowAnonymous]
        public async Task<ActionResult<OutputInvoiceDto>> GetInvoiceById(int invoiceId)
        {
            var invoice = await _repository.GetInvoiceByIdAsync(invoiceId);

            if (invoice == null)
            {
                _logger.LogWarning($"Invoice with ID {invoiceId} not found.");
                return NotFound($"Invoice with ID {invoiceId} not found.");
            }

            // Start all tasks concurrently
            var scheduleTask = _scheduleHttpService.GetScheduleByInvoiceId(invoice.Id);
            var customerTask = _customerHttpService.GetCustomerById(invoice.CustomerId);
            Employee employee = new Employee();
            if (invoice.EmployeeId != 0)
            {
                var employeeTask = _employeeHttpService.GetEmployeeById(invoice.EmployeeId);
                employee = await employeeTask;

            }
            else
            {
                employee = null;
            }

            // Wait for all tasks to complete
            await Task.WhenAll(scheduleTask, customerTask);

            var schedules = await scheduleTask;
            var customer = await customerTask;

            _logger.LogInformation($"Schedules: {JsonSerializer.Serialize(schedules)}");
            // Get Movie
            var movie = await _movieHttpService.GetMovieById(schedules[0].MovieId);
            var venueInfo = await _theaterHttpService.GetVenueBySeatId(schedules[0].SeatId);

            // Get Seats
            List<Seat> seats = new List<Seat>();
            foreach (var ticket in schedules)
            {
                var seat = await _theaterHttpService.GetSeatById(ticket.SeatId);
                seats.Add(seat);
            }    

            // GetFoods
            var invoiceFoods = await _invoiceFoodRepo.GetInvoiceFoodsByInvoiceIdAsync(invoiceId);
            List<Dtos.Food> foods = new List<Dtos.Food>();
            foreach (var invoiceFood in invoiceFoods)
            {
                var foodItem = await _foodRepo.GetFoodByIdAsync(invoiceFood.FoodId);
                var food = new Dtos.Food
                {
                    Id = invoiceFood.FoodId,
                    Name = foodItem.Name,
                    Price = foodItem.Price ?? 0,
                    Quantity = invoiceFood.Quantity ?? 0,
                };
                foods.Add(food);
            }

            // Check if customer and employee are not null before proceeding
            if (customer == null) _logger.LogWarning($"Customer with ID {invoice.CustomerId} not found for InvoiceId: {invoice.Id}");
            if (employee == null) _logger.LogWarning($"Employee with ID {invoice.EmployeeId} not found for InvoiceId: {invoice.Id}");

            var employeeName = employee != null ? employee.Name : "";

            var invoiceReadDto = new OutputInvoiceDto
            {
                Id = invoice.Id,
                EmployeeId = invoice.EmployeeId,
                EmployeeName = employeeName,
                CustomerId = invoice.CustomerId,
                CustomerName = customer.Name,
                CustomerPhone = customer.Phone,
                CustomerEmail = customer.Email,
                CreatedDate = invoice.CreatedDate,
                Date = schedules[0].Date,
                Time = schedules[0].Time,
                Movie = movie,
                TheaterId = venueInfo.TheaterId,
                TheaterName = venueInfo.TheaterName,
                RoomId = venueInfo.RoomId,
                RoomName = venueInfo.RoomName,
                Seats = seats,
                Foods = foods,
                PromotionId = invoice.PromotionId,
                PaymentMethod = invoice.PaymentMethod,
                Total = invoice.Total,
                Status = invoice.Status,
            };

            return Ok(invoiceReadDto);
        }

        [HttpGet("GetInvoicesByCustomerId/{customerId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<InvoiceReadDto>>> GetInvoicesByCustomerId(int customerId)
        {
            // Fetch invoices for the given customerId
            var invoices = await _repository.GetInvoicesByCustomerId(customerId);

            if (invoices == null || !invoices.Any())
            {
                _logger.LogWarning($"No invoices found for CustomerId: {customerId}");
                return NotFound($"No invoices found for CustomerId: {customerId}");
            }

            var invoiceReadDtos = new List<InvoiceReadDto>();

            foreach (var invoice in invoices)
            {
                // Fetch schedules, customer, and employee concurrently
                var scheduleTask = _scheduleHttpService.GetScheduleByInvoiceId(invoice.Id);
                Employee employee = new Employee();
                if (invoice.EmployeeId != 0)
                {
                    var employeeTask = _employeeHttpService.GetEmployeeById(invoice.EmployeeId);
                    employee = await employeeTask;

                }
                else
                {
                    employee = null;
                }
                // Await all tasks to complete
                await Task.WhenAll(scheduleTask);

                var schedules = await scheduleTask;

                // Logging if customer or employee information is not found
                if (employee == null)
                {
                    _logger.LogWarning($"Employee with ID {invoice.EmployeeId} not found for InvoiceId: {invoice.Id}");
                }

                // Create InvoiceReadDto with the fetched information
                var invoiceReadDto = new InvoiceReadDto
                {
                    Id = invoice.Id,
                    EmployeeId = invoice.EmployeeId,
                    CustomerId = invoice.CustomerId,
                    PromotionId = invoice.PromotionId,
                    CreatedDate = invoice.CreatedDate,
                    PaymentMethod = invoice.PaymentMethod,
                    Total = invoice.Total,
                    Status = invoice.Status,
                    Schedules = schedules,
                    Customer = null,
                    Employee = employee,
                };

                invoiceReadDtos.Add(invoiceReadDto);
            }

            return Ok(invoiceReadDtos);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<InvoiceRequestModel> CreateInvoice([FromBody] VnPaymentRequestModel paymentRequest)
        {
            if (paymentRequest == null)
            {
                return null;
            }

            var invoice = new InvoiceRequestModel
            {
                CreatedDate = paymentRequest.Invoice.CreatedDate,
                CustomerId = paymentRequest.Invoice.CustomerId,
                EmployeeId = paymentRequest.Invoice.EmployeeId,
                PromotionId = paymentRequest.Invoice.PromotionId,
                PaymentMethod = paymentRequest.Invoice.PaymentMethod,
                Total = paymentRequest.Invoice.Total,
                SeatIds = paymentRequest.Invoice.SeatIds,
                FoodRequests = paymentRequest.Invoice.FoodRequests ?? new List<FoodRequestModel>(),
                Schedule = paymentRequest.Invoice.Schedule
            };

            var invoiceCreate = new Invoice
            {
                CreatedDate = invoice.CreatedDate,
                CustomerId = invoice.CustomerId,
                EmployeeId = invoice.EmployeeId,
                PromotionId = invoice.PromotionId,
                PaymentMethod = invoice.PaymentMethod,
                Total = invoice.Total,
                Status = "Completed",
            };

            var createdInvoice = await _repository.CreateInvoiceAsync(invoiceCreate);
            _logger.LogInformation("Invoice created successfully. Invoice ID: {InvoiceId}", createdInvoice.Id);

            if (invoice.FoodRequests != null && invoice.FoodRequests.Any())
            {
                foreach (var foodRequest in invoice.FoodRequests)
                {
                    var invoiceFood = new InvoiceFood
                    {
                        InvoiceId = createdInvoice.Id,
                        FoodId = foodRequest.FoodId,
                        Quantity = foodRequest.Quantity
                    };
                    await _invoiceFoodRepo.CreateInvoiceFoodAsync(invoiceFood);
                    _logger.LogInformation("Invoice food created successfully. Food ID: {FoodId}", invoiceFood.FoodId);
                }
            }

            var schedules = invoice.SeatIds?.Select(seatId => new OriginalSchedule
            {
                MovieId = invoice.Schedule.MovieId,
                Date = invoice.Schedule.Date,
                Time = invoice.Schedule.Time,
                SeatId = seatId,
                InvoiceId = createdInvoice.Id,
            }).ToList();
            if (schedules != null)
            {
                _salePublisherService.UpdateInvoiceIdInSchedule(schedules);
                _logger.LogInformation("Update invoice successfully!");
            }

            return invoice;
        }

        [HttpDelete]
        [Authorize(Policy = "AdminOnly")]
        public async Task<bool> DeleteInvoice(int movieId, DateOnly date, TimeOnly time, int seatId, int invoiceId)
        {
            if (invoiceId == null)
            {
                return false;
            }

            try
            {
                // Delete InvoiceFood
                await _invoiceFoodRepo.DeleteInvoiceFoodByInvoiceIdAsync(invoiceId);
                //Delete Invoice
                await _repository.DeleteInvoiceAsync(invoiceId);
                // Update schedules with invoiceId = null
                var invoice = await _repository.GetInvoiceByIdAsync(invoiceId);
                var schedule = new OriginalSchedule
                {
                    MovieId = movieId,
                    Date = date,
                    Time = time,
                    SeatId = seatId,
                    InvoiceId = null,
                };

                if (schedule != null)
                {
                    _salePublisherService.UpdateEachInvoiceIdInSchedule(schedule);
                    _logger.LogInformation("Update invoice successfully!");
                }

                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("Error: {Error}", e.Message);
                return false;
            }
        }
        [HttpGet("count")]
        [AllowAnonymous]
        public async Task<ActionResult<int>> GetInvoiceCount()
        {
            try
            {
                var count = await _repository.GetInvoiceCountAsync();
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving invoice count.");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
