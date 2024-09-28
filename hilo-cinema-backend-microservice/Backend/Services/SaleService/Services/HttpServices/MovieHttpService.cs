using SaleService.OtherModels;
using System.Text.Json;

namespace SaleService.Services.HttpServices
{
    public class MovieHttpService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<MovieHttpService> _logger;

        public MovieHttpService(IHttpClientFactory httpClientFactory, ILogger<MovieHttpService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<Movie> GetMovieById(int movieId)
        {
            var client = _httpClientFactory.CreateClient("MovieService");

            try
            {
                var response = await client.GetAsync($"{movieId}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for movie request: {ResponseContent}", responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var movie = JsonSerializer.Deserialize<Movie>(responseContent, options);
                        _logger.LogInformation("Deserialized movie: {movie}", movie);
                        return movie ?? new Movie();
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for movie request");
                        return new Movie();
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve . Status code: {StatusCode}", response.StatusCode);
                    return new Movie();
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving movie");
                return new Movie();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving movie");
                return new Movie();
            }
        }
    }
}
