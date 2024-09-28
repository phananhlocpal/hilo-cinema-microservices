using AuthenticationService.Models;
using AuthenticationService.OtherModels;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using MessageBrokerService;
using AuthenticationService.Repositories.CustomerRepositories;

namespace AuthenticationService.Services
{
    public class CustomerAuthenticationCreateConsumer : BaseMessageBroker, IHostedService
    {
        private readonly ILogger<CustomerAuthenticationCreateConsumer> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private const string QueueName = "customer_authen_create";

        public CustomerAuthenticationCreateConsumer(
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
            var repository = scope.ServiceProvider.GetRequiredService<ICustomerRepo>();

            try
            {
                _logger.LogInformation("Message received from queue.");

                var body = e.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                // Deserialize the message
                var customerFromMessage = JsonSerializer.Deserialize<Customer>(message);
                _logger.LogInformation($"Custumer From Message is {customerFromMessage?.Email}");

                if (customerFromMessage != null)
                {
                    // Process the customer authentication creation
                    await CreateCustomerAuthen(customerFromMessage, repository);

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

        private async Task CreateCustomerAuthen(Customer customer, ICustomerRepo customerRepo)
        {
            await customerRepo.CreateCustomerAsync(customer);
            await customerRepo.SaveChangeAsync();
        }
    }
}