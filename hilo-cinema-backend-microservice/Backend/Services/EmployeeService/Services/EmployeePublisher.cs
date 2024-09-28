// EmployeePublisher.cs
using EmployeeService.Dtos;
using EmployeeService.Models;
using MessageBrokerService;
using System.Text.Json;

namespace EmployeeService.Services
{
    public class EmployeePublisher : BaseMessageBroker
    {
        private readonly ILogger _logger;

        public EmployeePublisher(ILogger<EmployeePublisher> logger) : base(logger)
        {
            _logger = logger;
            DeclareQueue("employee_authen");
        }

        public void PublishEmployeeCreation(Employee employee)
        {
            var queueName = "employee_authen";
            PublishMessage(queueName, employee);
            _logger.LogInformation("Message published successfully.");
        }

    }
}
