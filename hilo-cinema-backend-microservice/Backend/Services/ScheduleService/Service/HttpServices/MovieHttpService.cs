using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using ScheduleService.Dtos;
using ScheduleService.OtherModels;

namespace ScheduleService.Service.HttpServices
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

        public async Task<Movie> GetMovieById(int id)
        {
            var client = _httpClientFactory.CreateClient("MovieService");
            _logger.LogInformation("Requesting movie with ID: {MovieId}", id);

            try
            {
                var response = await client.GetAsync($"{id}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for movie ID {MovieId}: {ResponseContent}", id, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var movie = JsonSerializer.Deserialize<Movie>(responseContent, options);
                        _logger.LogInformation("Deserialized movie: {@MovieDetails}", movie);
                        _logger.LogInformation("Deserialized movie properties - ID: {Id}, Title: {Title}, Url: {Url}", movie.Id, movie.Title, movie.MovieUrl);
                        return movie;
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for movie ID {MovieId}", id);
                        return null;
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve movie with ID: {MovieId}. Status code: {StatusCode}", id, response.StatusCode);
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving movie with ID {MovieId}", id);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving movie with ID {MovieId}", id);
                return null;
            }
        }

        public async Task<MQMovie> GetMovieByUrl(string url)
        {
            var client = _httpClientFactory.CreateClient("MovieService");
            _logger.LogInformation("Requesting movie with URL: {MovieUrl}", url);

            try
            {
                var response = await client.GetAsync($"url/{url}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for movie ID {MovieUrl}: {ResponseContent}", url, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var movie = JsonSerializer.Deserialize<MQMovie>(responseContent, options);
                        _logger.LogInformation("Deserialized movie: {@MovieDetails}", movie);
                        _logger.LogInformation("Deserialized movie properties - ID: {Id}, Title: {Title}, Url: {Url}", movie.Id, movie.Title, movie.MovieUrl);
                        return movie;
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for movie ID {MovieUrl}", url);
                        return null;
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve movie with ID: {MovieUrl}. Status code: {StatusCode}", url, response.StatusCode);
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving movie with ID {MovieUrl}", url);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving movie with ID {MovieUrl}", url);
                return null;
            }
        }

    }
}
