using Microsoft.AspNetCore.Connections;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Text.Json;
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace TheaterService.Service
{
    public abstract class MessageService
    {
        private readonly IConnection _connection;
        protected readonly RabbitMQ.Client.IModel _channel;
        protected readonly ILogger<MessageService> _logger;

        protected MessageService(ILogger<MessageService> logger)
        {
            _logger = logger;

            var factory = new ConnectionFactory
            {
                HostName = "localhost",
                UserName = "admin",
                Password = "admin",
                VirtualHost = "/"
            };

            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();
        }

        protected void DeclareQueue(string queueName)
        {
            _channel.QueueDeclare(queue: queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
        }

        protected void PublishMessage<T>(string queueName, T message, string correlationId = null, string replyTo = null)
        {
            var props = _channel.CreateBasicProperties();
            if (correlationId != null)
            {
                props.CorrelationId = correlationId;
            }
            if (replyTo != null)
            {
                props.ReplyTo = replyTo;
            }

            var messageBytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
            _channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: props, body: messageBytes);
        }

        protected void ConsumeMessage(string queueName, EventHandler<BasicDeliverEventArgs> receivedHandler)
        {
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += receivedHandler;
            _channel.BasicConsume(queue: queueName, autoAck: true, consumer: consumer);
        }

        public virtual void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
        }
    }
}
