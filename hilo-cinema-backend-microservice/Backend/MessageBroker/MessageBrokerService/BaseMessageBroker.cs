using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;

namespace MessageBrokerService
{
    public class BaseMessageBroker
    {
        private readonly IConnection _connection;
        private readonly RabbitMQ.Client.IModel _channel;
        private readonly ILogger<BaseMessageBroker> _logger;
        private bool _disposed = false;

        public BaseMessageBroker(ILogger<BaseMessageBroker> logger)
        {
            _logger = logger;

            var factory = new ConnectionFactory
            {
                HostName = "localhost",
                UserName = "guest",
                Password = "guest",
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

        protected void ConsumeMessage(string queueName, EventHandler<BasicDeliverEventArgs> receivedHandler, bool autoAck = false)
        {
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += receivedHandler;
            _channel.BasicConsume(queue: queueName, autoAck: autoAck, consumer: consumer);
        }

        protected void AcknowledgeMessage(ulong deliveryTag, bool multiple = false)
        {
            _channel.BasicAck(deliveryTag, multiple);
        }

        protected void NacknowledgeMessage(ulong deliveryTag, bool requeue = true)
        {
            _channel.BasicNack(deliveryTag, false, requeue);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _channel?.Dispose();
                    _connection?.Dispose();
                }
                _disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~BaseMessageBroker()
        {
            Dispose(false);
        }
    }
}
