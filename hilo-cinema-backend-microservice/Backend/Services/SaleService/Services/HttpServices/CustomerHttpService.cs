using SaleService.OtherModels;
using System.Text.Json;

namespace SaleService.Services.HttpServices
{
    public class CustomerHttpService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<CustomerHttpService> _logger;

        public CustomerHttpService(IHttpClientFactory httpClientFactory, ILogger<CustomerHttpService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<Customer> GetCustomerById(int customerId)
        {
            var client = _httpClientFactory.CreateClient("CustomerService");

            try
            {
                var response = await client.GetAsync($"{customerId}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for customer request: {ResponseContent}", responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var customer = JsonSerializer.Deserialize<Customer>(responseContent, options);
                        _logger.LogInformation("Deserialized customer: {customer}", customer);
                        return customer ?? new Customer();
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for customer request");
                        return new Customer();
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve customer. Status code: {StatusCode}", response.StatusCode);
                    return new Customer();
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving customer");
                return new Customer();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving customer");
                return new Customer();
            }
        }
    }
}
