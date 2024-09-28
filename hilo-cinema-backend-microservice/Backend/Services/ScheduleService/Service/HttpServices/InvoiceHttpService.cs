using ScheduleService.OtherModels;
using System.Text.Json;

namespace ScheduleService.Service.HttpServices
{
    public class InvoiceHttpService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<InvoiceHttpService> _logger;

        public InvoiceHttpService(IHttpClientFactory httpClientFactory, ILogger<InvoiceHttpService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<Invoice> GetInvoiceById(int id)
        {
            var client = _httpClientFactory.CreateClient("InvoiceService");
            _logger.LogInformation("Requesting Invoice with ID: {InvoiceId}", id);

            try
            {
                var response = await client.GetAsync($"{id}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for Invoice ID {InvoiceId}: {ResponseContent}", id, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var invoice = JsonSerializer.Deserialize<Invoice>(responseContent, options);
                        _logger.LogInformation("Deserialized invoice: {@InvoiceDetails}", invoice);
                        _logger.LogInformation("Deserialized Invoice properties - ID: {Id}", invoice.Id);
                        return invoice;
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for Invoice ID {InvoiceId}", id);
                        return null;
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve Invoice with ID: {InvoiceId}. Status code: {StatusCode}", id, response.StatusCode);
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving Invoice with ID {InvoiceId}", id);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving Invoice with ID {InvoiceId}", id);
                return null;
            }
        }
    }
}
