using SaleService.OtherModels;
using System.Text.Json;

namespace SaleService.Services.HttpServices
{
    public class EmployeeHttpService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<EmployeeHttpService> _logger;

        public EmployeeHttpService(IHttpClientFactory httpClientFactory, ILogger<EmployeeHttpService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<Employee> GetEmployeeById(int employeeId)
        {
            var client = _httpClientFactory.CreateClient("EmployeeService");

            try
            {
                var response = await client.GetAsync($"{employeeId}");
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
                        var employee = JsonSerializer.Deserialize<Employee>(responseContent, options);
                        _logger.LogInformation("Deserialized employee: {Employee}", employee);
                        return employee ?? new Employee();
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for employee request");
                        return new Employee();
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve employee. Status code: {StatusCode}", response.StatusCode);
                    return new Employee();
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving employee");
                return new Employee();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving employee");
                return new Employee();
            }
        }
    }
}
