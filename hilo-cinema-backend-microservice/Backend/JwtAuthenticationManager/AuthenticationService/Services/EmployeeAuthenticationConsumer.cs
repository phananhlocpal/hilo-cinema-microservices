using AuthenticationService.Models;
using AuthenticationService.OtherModels;
using AuthenticationService.Repositories.EmployeeRepositories;
using MessageBrokerService;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace AuthenticationService.Services
{
    public class EmployeeAuthenticationConsumer : BaseMessageBroker, IHostedService
    {
        private readonly ILogger<CustomerAuthenticationCreateConsumer> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private const string QueueName = "employee_authen";

        public EmployeeAuthenticationConsumer(
            ILogger<CustomerAuthenticationCreateConsumer> logger,
            IServiceScopeFactory scopeFactory) : base(logger)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;

            DeclareQueue(QueueName);
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            ConsumeMessage(QueueName, HandleMessage);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Dispose();
            return Task.CompletedTask;
        }

        private async void HandleMessage(object sender, BasicDeliverEventArgs e)
        {
            using var scope = _scopeFactory.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<IEmployeeRepo>();

            try
            {
                _logger.LogInformation("Message received from queue.");

                var body = e.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                _logger.LogInformation("log message is: {message}", message);

                // Deserialize the message
                var employeeFromMessage = JsonSerializer.Deserialize<Employee>(message);
                _logger.LogInformation($"Custumer From Message is {employeeFromMessage?.Email}");

                if (employeeFromMessage != null)
                {
                    
                    // Process the customer authentication creation
                    await CreateEmployeeAuthen(employeeFromMessage, repository);

                    // Acknowledge the message
                    AcknowledgeMessage(e.DeliveryTag);
                }
                else
                {
                    _logger.LogWarning("Received an invalid customer authentication message.");
                    // Optionally, nack the message to requeue or handle differently
                    NacknowledgeMessage(e.DeliveryTag);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing customer authentication message.");
                // Optionally, nack the message to requeue or handle differently
                NacknowledgeMessage(e.DeliveryTag);
            }
        }

        private async Task CreateEmployeeAuthen(Employee employee, IEmployeeRepo employeeRepo)
        {
            await employeeRepo.CreateEmployeeAsync(employee);
            await employeeRepo.SaveChangeAsync();
        }
    }
}
