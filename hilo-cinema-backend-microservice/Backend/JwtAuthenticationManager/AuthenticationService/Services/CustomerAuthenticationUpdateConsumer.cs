using AuthenticationService.Models;
using AuthenticationService.Repositories.CustomerRepositories;
using MessageBrokerService;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace AuthenticationService.Services
{
    public class CustomerAuthenticationUpdateConsumer : BaseMessageBroker, IHostedService
    {
        private readonly ILogger<CustomerAuthenticationUpdateConsumer> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private const string QueueName = "customer_authen_update";

        public CustomerAuthenticationUpdateConsumer(
            ILogger<CustomerAuthenticationUpdateConsumer> logger,
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

        private async void HandleMessage(object? sender, BasicDeliverEventArgs e)
        {
            using var scope = _scopeFactory.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<ICustomerRepo>();

            try
            {
                _logger.LogInformation("Message received from queue.");

                var body = e.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                // Deserialize the message
                var customerFromMessage = JsonSerializer.Deserialize<Customer>(message);
                _logger.LogInformation($"Custumer from (Updated) message is {customerFromMessage?.Email}");

                if (customerFromMessage != null)
                {
                    // Process the customer authentication creation
                    await UpdateCustomerAuthen(customerFromMessage, repository);

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

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Dispose();
            return Task.CompletedTask;
        }

        private async Task UpdateCustomerAuthen(Customer customer, ICustomerRepo customerRepo)
        {
            await customerRepo.UpdateCustomerAsync(customer);
            await customerRepo.SaveChangeAsync();
        }
    }
}