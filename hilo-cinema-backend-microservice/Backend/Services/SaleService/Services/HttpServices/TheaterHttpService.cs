using SaleService.OtherModels;
using System.Text.Json;

namespace SaleService.Services.HttpServices
{
    public class TheaterHttpService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<TheaterHttpService> _logger;

        public TheaterHttpService(IHttpClientFactory httpClientFactory, ILogger<TheaterHttpService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<Venue> GetVenueBySeatId(int seatId)
        {
            var client = _httpClientFactory.CreateClient("SeatService");

            try
            {
                var response = await client.GetAsync($"getVenueBySeatId/{seatId}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for venue request: {ResponseContent}", responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var venue = JsonSerializer.Deserialize<Venue>(responseContent, options);
                        _logger.LogInformation("Deserialized venue: {Venue}", venue);
                        return venue ?? new Venue();
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for Venue request");
                        return new Venue();
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve Venue. Status code: {StatusCode}", response.StatusCode);
                    return new Venue();
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving Venue");
                return new Venue();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving Venue");
                return new Venue();
            }
        }

        public async Task<Seat> GetSeatById(int seatId)
        {
            var client = _httpClientFactory.CreateClient("SeatService");

            try
            {
                var response = await client.GetAsync($"{seatId}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for venue request: {ResponseContent}", responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var seat = JsonSerializer.Deserialize<Seat>(responseContent, options);
                        _logger.LogInformation("Deserialized seat: {Seat}", seat);
                        return seat ?? new Seat();
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for seat request");
                        return new Seat();
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve seat. Status code: {StatusCode}", response.StatusCode);
                    return new Seat();
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving seat");
                return new Seat();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving Venue");
                return new Seat();
            }
        }

        public class Venue
        {
            public int RoomId { get; set; }
            public string RoomName {  get; set; }
            public int TheaterId { get; set; }
            public string TheaterName { get; set; }

        }
    }
}
