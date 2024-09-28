
﻿using MessageBrokerService;
using RabbitMQ.Client.Events;
using ScheduleService.Models;
using ScheduleService.Repositories.ScheduleRepository;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ScheduleService.Helper;

namespace ScheduleService.Service.MessagerBrokerServices
{
    public class ScheduleConsumerService : BaseMessageBroker, IHostedService
    {
        private readonly ILogger<ScheduleConsumerService> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private const string QueueName = "sale_schedule";

        public ScheduleConsumerService(
            ILogger<ScheduleConsumerService> logger,
            IServiceScopeFactory scopeFactory) : base(logger)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;

            DeclareQueue(QueueName);
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting to consume messages from queue '{QueueName}'.", QueueName);
            ConsumeMessage(QueueName, HandleMessage);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Stopping the message consumer for queue '{QueueName}'.", QueueName);
            Dispose();
            return Task.CompletedTask;
        }

        private async void HandleMessage(object sender, BasicDeliverEventArgs e)
        {
            using var scope = _scopeFactory.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<IScheduleRepo>();

            try
            {
                _logger.LogInformation("Message received from queue '{QueueName}'.", QueueName);

                var body = e.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                _logger.LogInformation("Message body: {Message}", message);

                var scheduleUpdateMessage = JsonSerializer.Deserialize<Schedule>(message);
                _logger.LogInformation("Data after JSON deserializer: {ScheduleUpdateMessage}", scheduleUpdateMessage);


                if (scheduleUpdateMessage != null)
                {
                    // Process the schedule update
                    await ProcessScheduleUpdate(scheduleUpdateMessage, repository);

                    // Acknowledge the message
                    AcknowledgeMessage(e.DeliveryTag);
                    _logger.LogInformation("Message acknowledged.");
                }
                else
                {
                    _logger.LogWarning("Received an invalid schedule update message.");
                    NacknowledgeMessage(e.DeliveryTag); // Optionally nack the message
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing schedule update message.");
                NacknowledgeMessage(e.DeliveryTag); // Optionally nack the message
            }
        }


        private async Task ProcessScheduleUpdate(Schedule schedule, IScheduleRepo scheduleRepo)
        {
            _logger.LogInformation("Processing schedule update for schedule with seatId {SeatId}.", schedule.SeatId);
            await scheduleRepo.UpdateScheduleAsync(schedule);
            _logger.LogInformation("Schedule with seatId {SeatId} processed successfully.", schedule.SeatId);
        }
    }
}
