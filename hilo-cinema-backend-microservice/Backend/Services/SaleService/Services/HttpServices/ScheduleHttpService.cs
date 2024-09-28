using SaleService.Dtos;
using SaleService.OtherModels;
using System.Text.Json;

namespace SaleService.Services.HttpServices
{
    public class ScheduleHttpService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ScheduleHttpService> _logger;

        public ScheduleHttpService(IHttpClientFactory httpClientFactory, ILogger<ScheduleHttpService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<List<RawSchedule>> GetScheduleByInvoiceId(int invoiceId)
        {
            var client = _httpClientFactory.CreateClient("ScheduleService");

            try
            {
                _logger.LogInformation("Movie request for invoice id: {InvoiceId}", invoiceId);
                var response = await client.GetAsync($"GetScheduleByInvoiceId/{invoiceId}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for schedule request: {ResponseContent}", responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var schedules = JsonSerializer.Deserialize<List<RawSchedule>>(responseContent, options);
                        _logger.LogInformation("Deserialized schedules: {@ScheduleDetails}", schedules);
                        return schedules ?? new List<RawSchedule>(); // Return an empty list if deserialization returns null
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for schedule request");
                        return new List<RawSchedule>(); // Return an empty list on deserialization error
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve schedule. Status code: {StatusCode}", response.StatusCode);
                    return new List<RawSchedule>(); // Return an empty list if the response status is not success
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving schedule");
                return new List<RawSchedule>(); // Return an empty list on HTTP request error
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving schedule");
                return new List<RawSchedule>(); // Return an empty list on unexpected error
            }
        }
    }
}
