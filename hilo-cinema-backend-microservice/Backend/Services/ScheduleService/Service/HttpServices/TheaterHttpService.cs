using ScheduleService.Dtos;
using ScheduleService.OtherModels;
using System.Text.Json;

namespace ScheduleService.Service.HttpServices
{
    public class TheaterHttpService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<MovieHttpService> _logger;

        public TheaterHttpService(IHttpClientFactory httpClientFactory, ILogger<MovieHttpService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<Seat> GetSeatById(int id)
        {
            var client = _httpClientFactory.CreateClient("SeatService");
            _logger.LogInformation("Requesting seat with ID: {SeatId}", id);

            try
            {
                var response = await client.GetAsync($"{id}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for seat ID {SeatId}: {ResponseContent}", id, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var seat = JsonSerializer.Deserialize<Seat>(responseContent, options);
                        _logger.LogInformation("Deserialized seat: {@SeatDetails}", seat);
                        _logger.LogInformation("Deserialized seat properties - ID: {Id}, ColSeat: {ColSeat}, RowSeat: {RowSeat}", seat.Id, seat.ColSeat, seat.RowSeat);
                        return seat;
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for seat ID {SeatId}", id);
                        return null;
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve seat with ID: {SeatId}. Status code: {StatusCode}", id, response.StatusCode);
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving seat with ID {SeatId}", id);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving seat with ID {SeatId}", id);
                return null;
            }
        }

        public async Task<IEnumerable<Seat>> GetSeatsByRoomId(int roomId)
        {
            var client = _httpClientFactory.CreateClient("SeatService");
            _logger.LogInformation("Requesting seats with roomId: {RoomId}", roomId);

            try
            {
                var response = await client.GetAsync($"GetSeatsByRoom/{roomId}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for roomId {RoomId}: {ResponseContent}", roomId, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var seats = JsonSerializer.Deserialize<IEnumerable<Seat>>(responseContent, options);
                        _logger.LogInformation("Deserialized seats for roomId: {RoomId}", roomId);

                        if (seats != null)
                        {
                            _logger.LogInformation("Deserialized seats count: {Count}", seats.Count());
                        }
                        else
                        {
                            _logger.LogWarning("Deserialized seats are null for roomId: {RoomId}", roomId);
                        }

                        return seats ?? Enumerable.Empty<Seat>();
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for roomId {RoomId}", roomId);
                        return Enumerable.Empty<Seat>();
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve seats for roomId: {RoomId}. Status code: {StatusCode}", roomId, response.StatusCode);
                    return Enumerable.Empty<Seat>();
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving seats for roomId {RoomId}", roomId);
                return Enumerable.Empty<Seat>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving seats for roomId {RoomId}", roomId);
                return Enumerable.Empty<Seat>();
            }
        }

        public async Task<Room> GetRoomById(int id)
        {
            var client = _httpClientFactory.CreateClient("RoomService");
            _logger.LogInformation("Requesting room with ID: {MovieId}", id);

            try
            {
                var response = await client.GetAsync($"{id}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for room ID {MovieId}: {ResponseContent}", id, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var room = JsonSerializer.Deserialize<Room>(responseContent, options);
                        _logger.LogInformation("Deserialized room: {@RoomDetails}", room);
                        _logger.LogInformation("Deserialized room properties - ID: {Id}, Name: {Name}", room.Id, room.Name);
                        return room;
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for room ID {RoomId}", id);
                        return null;
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve room with ID: {RoomId}. Status code: {StatusCode}", id, response.StatusCode);
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving room with ID {RoomId}", id);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving room with ID {RoomId}", id);
                return null;
            }
        }

        public async Task<Room> GetRoomBySeatId(int seatId)
        {
            var client = _httpClientFactory.CreateClient("SeatService");
            _logger.LogInformation("Requesting room with seatId: {MovieId}", seatId);

            try
            {
                var response = await client.GetAsync($"getRoomBySeatId/{seatId}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for seatId {seatId}: {ResponseContent}", seatId, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var room = JsonSerializer.Deserialize<Room>(responseContent, options);
                        _logger.LogInformation("Deserialized room: {@RoomDetails}", room);
                        _logger.LogInformation("Deserialized room properties - ID: {Id}, Name: {Name}", room.Id, room.Name);
                        return room;
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for seatId {seatId}", seatId);
                        return null;
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve room with ID: {RoomId}. Status code: {StatusCode}", seatId, response.StatusCode);
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving room with ID {RoomId}", seatId);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving room with ID {RoomId}", seatId);
                return null;
            }
        }

        public async Task<Theater> GetTheaterById(int id)
        {
            var client = _httpClientFactory.CreateClient("TheaterService");
            _logger.LogInformation("Requesting theater with ID: {MovieId}", id);

            try
            {
                var response = await client.GetAsync($"{id}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for theater ID {MovieId}: {ResponseContent}", id, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var theater = JsonSerializer.Deserialize<Theater>(responseContent, options);
                        _logger.LogInformation("Deserialized theater: {@TheaterDetails}", theater);
                        _logger.LogInformation("Deserialized theater properties - ID: {Id}, Name: {Name}", theater.Id, theater.Name);
                        return theater;
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for theater ID {TheaterId}", id);
                        return null;
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve theater with ID: {TheaterId}. Status code: {StatusCode}", id, response.StatusCode);
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving theater with ID {TheaterId}", id);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving theater with ID {TheaterId}", id);
                return null;
            }
        }

        public async Task<Theater> GetTheaterByRoomId(int roomId)
        {
            var client = _httpClientFactory.CreateClient("RoomService");
            _logger.LogInformation("Requesting theater with ID: {roomId}", roomId);

            try
            {
                var response = await client.GetAsync($"getTheaterByRoomId/{roomId}");
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("Response content for theater ID {MovieId}: {ResponseContent}", roomId, responseContent);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        var theater = JsonSerializer.Deserialize<Theater>(responseContent, options);
                        _logger.LogInformation("Deserialized theater: {@TheaterDetails}", theater);
                        _logger.LogInformation("Deserialized theater properties - ID: {Id}, Name: {Name}", theater.Id, theater.Name);
                        return theater;
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing response content for theater ID {TheaterId}", roomId);
                        return null;
                    }
                }
                else
                {
                    _logger.LogWarning("Failed to retrieve theater with ID: {TheaterId}. Status code: {StatusCode}", roomId, response.StatusCode);
                    return null;
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error while retrieving theater with ID {TheaterId}", roomId);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while retrieving theater with ID {TheaterId}", roomId);
                return null;
            }
        }
    }
}
