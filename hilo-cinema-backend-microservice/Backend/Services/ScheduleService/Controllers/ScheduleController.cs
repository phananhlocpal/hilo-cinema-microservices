using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ScheduleService.Repositories.ScheduleRepository;
using ScheduleService.Dtos;
using ScheduleService.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScheduleService.OtherModels;
using ScheduleService.Service.HttpServices;
using Microsoft.AspNetCore.Authorization;

namespace ScheduleService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleRepo _repository;
        private readonly IMapper _mapper;
        private readonly MovieHttpService _movieHttpService;
        private readonly TheaterHttpService _theaterHttpService;
        private readonly InvoiceHttpService _invoiceHttpService;
        private readonly ILogger<ScheduleController> _logger;

        public ScheduleController(
            IScheduleRepo repository,
            IMapper mapper,
            MovieHttpService movieHttpService,
            TheaterHttpService theaterHttpService,
            InvoiceHttpService invoiceHttpService,
            ILogger<ScheduleController> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _movieHttpService = movieHttpService;
            _theaterHttpService = theaterHttpService;
            _invoiceHttpService = invoiceHttpService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ScheduleReadDto>>> GetAllSchedules()
        {
            var schedules = await _repository.GetAllScheduleAsync();

            var scheduleReadDtos = new List<ScheduleReadDto>();

            foreach (var schedule in schedules)
            {
                var movie = await _movieHttpService.GetMovieById(schedule.MovieId);
                Seat seat = await _theaterHttpService.GetSeatById(schedule.SeatId);
                Room room = (seat != null) ? await _theaterHttpService.GetRoomById(seat.RoomId) : null;
                Theater theater = (room != null) ? await _theaterHttpService.GetTheaterById(room.TheaterId) : null;

                var invoiceId = schedule.InvoiceId.GetValueOrDefault();
                var invoice = (schedule.InvoiceId.HasValue) ? await _invoiceHttpService.GetInvoiceById(invoiceId) : null;

                room.Theater = theater;
                seat.Room = room;

                var scheduleReadDto = new ScheduleReadDto
                {
                    Date = schedule.Date,
                    Time = schedule.Time,
                    InvoiceId = schedule.InvoiceId,
                    Movie = new Movie
                    {
                        Id = movie.Id,
                        Title = movie.Title,
                        MovieUrl = movie.MovieUrl,
                    },
                    Seat = seat,
                    Invoice = invoice,
                };

                scheduleReadDtos.Add(scheduleReadDto);
            }

            return Ok(scheduleReadDtos);
        }

        [HttpGet("GetAllBasicSchedule")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<object>>> GetAllBasicSchedule()
        {
            var schedules = await _repository.GetAllScheduleAsync();
           _logger.LogInformation($"Schedules count: {schedules.Count()}");

            var uniqueSeatIds = schedules.Select(s => s.SeatId).Distinct().ToList();
            var uniqueMovieIds = schedules.Select(s => s.MovieId).Distinct().ToList();
            var uniqueRoomIds = new HashSet<int>();

            var roomDictionary = new Dictionary<int, Room>();
            var theaterDictionary = new Dictionary<int, Theater>();
            var movieDictionary = new Dictionary<int, Movie>();

            var roomTasks = uniqueSeatIds.Select(async seatId =>
            {
                var room = await _theaterHttpService.GetRoomBySeatId(seatId);
                if (room != null)
                {
                    roomDictionary[seatId] = room;
                    uniqueRoomIds.Add(room.Id);
                }
                else
                {
                    Console.WriteLine($"Room not found for SeatId: {seatId}");
                }
            });
            await Task.WhenAll(roomTasks);

            var theaterTasks = uniqueRoomIds.Select(async roomId =>
            {
                var theater = await _theaterHttpService.GetTheaterByRoomId(roomId);
                if (theater != null)
                {
                    theaterDictionary[roomId] = theater;
                }
                else
                {
                    Console.WriteLine($"Theater not found for RoomId: {roomId}");
                }
            });
            await Task.WhenAll(theaterTasks);

            var movieTasks = uniqueMovieIds.Select(async movieId =>
            {
                var movie = await _movieHttpService.GetMovieById(movieId);
                if (movie != null)
                {
                    movieDictionary[movieId] = movie;
                }
                else
                {
                    Console.WriteLine($"Movie not found for MovieId: {movieId}");
                }
            });
            await Task.WhenAll(movieTasks);

            var results = schedules
                .GroupBy(s => new { s.SeatId, s.MovieId, s.Date, s.Time })
                .Select(g =>
                {
                    var schedule = g.First();
                    var room = roomDictionary.GetValueOrDefault(schedule.SeatId);
                    var theater = room != null ? theaterDictionary.GetValueOrDefault(room.Id) : null;
                    var movie = movieDictionary.GetValueOrDefault(schedule.MovieId);

                    if (room != null && theater != null && movie != null)
                    {
                        return new
                        {
                            TheaterId = theater.Id,
                            TheaterName = theater.Name,
                            RoomId = room.Id,
                            RoomName = room.Name,
                            Date = schedule.Date,
                            MovieId = movie.Id,
                            MovieName = movie.Title,
                            Time = schedule.Time,
                        };
                    }
                    else
                    {
                        if (room == null) Console.WriteLine($"Room is null for SeatId: {schedule.SeatId}");
                        if (theater == null) Console.WriteLine($"Theater is null for RoomId: {room?.Id}");
                        if (movie == null) Console.WriteLine($"Movie is null for MovieId: {schedule.MovieId}");
                    }

                    return null;
                })
                .Where(result => result != null)
                .Distinct()
                .ToList();

            return Ok(results);
        }


        [HttpGet("getSeatsBySchedule")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<object>>> GetSeatsBySchedude( int movieId, DateOnly date, int theaterId, int roomId, TimeOnly time)
        {
            var schedules = await _repository.GetSeatsBySchedude(movieId, date, theaterId, roomId, time);
            var room = await _theaterHttpService.GetRoomById(roomId);
            var theater = await _theaterHttpService.GetTheaterById(theaterId);

            var seats = new List<object>();

            foreach (var schedule in schedules)
            {
                var seat = await _theaterHttpService.GetSeatById(schedule.SeatId);
                if (seat.RoomId == roomId)
                {
                    seats.Add(new
                    {
                        Seat = seat,
                        InvoiceId = schedule.InvoiceId 
                    });

                }
            }

            object result = new
            {
                Room = room,
                Theater = theater,
                Schedules = schedules,
                Seats = seats,
            };

            return Ok(result);

        }

        [HttpGet("GetOnlyScheduleWithoutSeats")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ScheduleReadDto>>> GetOnlyScheduleWithoutSeats()
        {
            var schedules = await _repository.GetAllScheduleAsync();

            var scheduleReadDtos = new List<ScheduleReadDto>();

            foreach (var schedule in schedules)
            {
                var movie = await _movieHttpService.GetMovieById(schedule.MovieId);

                var scheduleReadDto = new ScheduleReadDto
                {
                    Date = schedule.Date,
                    Time = schedule.Time,
                    InvoiceId = schedule.InvoiceId,
                    Movie = new Movie
                    {
                        Id = movie.Id,
                        Title = movie.Title,
                        MovieUrl = movie.MovieUrl,
                    },
                };

                scheduleReadDtos.Add(scheduleReadDto);
            }

            return Ok(scheduleReadDtos);
        }

        [HttpGet("movieUrl/{url}")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetSchedulesByMovieUrl(string url)

        {
            var movie = await _movieHttpService.GetMovieByUrl(url);
            if (movie == null)
            {
                return NotFound();
            }

            var schedules = await _repository.GetSchedulesByMovieIdAsync(movie.Id);
            var scheduleMap = new Dictionary<string, Dictionary<int, TheaterScheduleDto>>();

            foreach (var schedule in schedules)
            {
                var seat = await _theaterHttpService.GetSeatById(schedule.SeatId);
                var room = (seat != null) ? await _theaterHttpService.GetRoomById(seat.RoomId) : null;
                var theater = (room != null) ? await _theaterHttpService.GetTheaterById(room.TheaterId) : null;
                var scheduleDate = schedule.Date.ToString("yyyy-MM-dd");

                if (!scheduleMap.ContainsKey(scheduleDate))
                {
                    scheduleMap[scheduleDate] = new Dictionary<int, TheaterScheduleDto>();
                }

                if (!scheduleMap[scheduleDate].ContainsKey(theater.Id))
                {
                    scheduleMap[scheduleDate][theater.Id] = new TheaterScheduleDto
                    {
                        TheaterId = theater.Id,
                        TheaterName = theater.Name,
                        RoomSchedules = new Dictionary<int, RoomScheduleDto>()
                    };
                }

                var theaterSchedule = scheduleMap[scheduleDate][theater.Id];

                if (!theaterSchedule.RoomSchedules.ContainsKey(room.Id))
                {
                    theaterSchedule.RoomSchedules[room.Id] = new RoomScheduleDto
                    {
                        RoomId = room.Id,
                        RoomName = room.Name,
                        Times = new List<string>()
                    };
                }

                var roomSchedule = theaterSchedule.RoomSchedules[room.Id];

                if (!roomSchedule.Times.Contains(schedule.Time.ToString("HH:mm")))
                {
                    roomSchedule.Times.Add(schedule.Time.ToString("HH:mm"));
                }
            }

            var formattedSchedule = scheduleMap.Select(sm => new
            {
                Date = sm.Key,
                TheaterSchedules = sm.Value.Values.Select(ts => new
                {
                    ts.TheaterId,
                    ts.TheaterName,
                    RoomSchedules = ts.RoomSchedules.Values.Select(rs => new
                    {
                        rs.RoomId,
                        rs.RoomName,
                        Times = rs.Times
                    }).ToList()
                }).ToList()
            }).ToList();

            var result = new
            {
                Movie = new
                {
                    Id = movie.Id,
                    Title = movie.Title,
                    MovieUrl = movie.MovieUrl,
                },
                Schedules = formattedSchedule

            };

            return Ok(result);
        }

        [HttpGet("GetScheduleByInvoiceId/{invoiceId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetScheduleByInvoiceId(int invoiceId)
        {
            var schedules = await _repository.GetScheduleByInvoiceIdAsync(invoiceId);

            return Ok(schedules);
        }

        // POST: api/schedule
        [HttpPost]
        [Authorize(Policy ="AdminOnly")]
        public async Task<ActionResult<ScheduleCreateDto>> CreateSchedule(ScheduleCreateDto scheduleCreateDto)
        {
            try
            {
                var schedules = new List<Schedule>();
                foreach (var seatId in scheduleCreateDto.SeatIds)
                {
                    var schedule = new Schedule
                    {
                        MovieId = scheduleCreateDto.MovieId,
                        Date = scheduleCreateDto.Date,
                        Time = scheduleCreateDto.Time,
                        SeatId = seatId,
                        InvoiceId = null
                    };
                    schedules.Add(schedule);
                }

                var createdSchedules = new List<Schedule>();
                foreach (var schedule in schedules)
                {
                    var createdSchedule = await _repository.CreateScheduleAsync(schedule);
                    createdSchedules.Add(createdSchedule);
                }

                var scheduleCreateDtoResponse = new ScheduleCreateDto
                {
                    MovieId = scheduleCreateDto.MovieId,
                    Date = scheduleCreateDto.Date,
                    Time = scheduleCreateDto.Time,
                    SeatIds = createdSchedules.Select(s => s.SeatId).ToList(),
                    InvoiceId = null,
                };

                return CreatedAtAction(nameof(GetAllSchedules), new { id = createdSchedules.First().MovieId }, scheduleCreateDtoResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating the schedule.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("CreateSchedule")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateSchedule(CreateScheduleInput createScheduleInput)
        {
            try
            {
                // Lấy danh sách ghế theo RoomId
                var seats = await _theaterHttpService.GetSeatsByRoomId(createScheduleInput.RoomId);
                if (seats == null || !seats.Any())
                {
                    _logger.LogWarning("No seats found for RoomId: {RoomId}", createScheduleInput.RoomId);
                    return BadRequest("No seats found for the selected room.");
                }

                // Tạo danh sách các lịch chiếu
                var schedules = seats.Select(seat => new Schedule
                {
                    MovieId = createScheduleInput.MovieId,
                    Date = createScheduleInput.Date,
                    Time = createScheduleInput.Time,
                    SeatId = seat.Id,
                    InvoiceId = null,
                }).ToList();

                // Kiểm tra danh sách lịch chiếu
                if (!schedules.Any())
                {
                    _logger.LogWarning("No schedules created. The list is empty.");
                    return BadRequest("No schedules created.");
                }

                // Gọi repository để lưu danh sách lịch chiếu
                await _repository.CreateSchedulesAsync(schedules);

                _logger.LogInformation("Schedules created successfully for MovieId: {MovieId}", createScheduleInput.MovieId);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create schedules.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create schedules.");
            }
        }


        [HttpPost("CheckIsExistInvoice")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckIsExistInvoice(int roomId, int movieId, DateOnly date, TimeOnly time)
        {
            try
            {
                // Lấy danh sách ghế theo RoomId
                var seats = await _theaterHttpService.GetSeatsByRoomId(roomId);
                if (seats == null || !seats.Any())
                {
                    _logger.LogWarning("No seats found for RoomId: {RoomId}", roomId);
                    return Ok(false); 
                }

                // Kiểm tra xem có vé nào với InvoiceId không
                foreach (var seat in seats)
                {
                    var schedule = await _repository.GetScheduleByCriteriaAsync(movieId:movieId, date:date, time:time, seatId:seat.Id);

                    if (schedule.InvoiceId != null)
                    {
                        return Ok(true); 
                    }
                }

                return Ok(false); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking for existing invoices.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error checking for existing invoices.");
            }
        }

        [HttpDelete("DeleteSchedule")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteSchedule(int roomId, int movieId, DateOnly date, TimeOnly time)
        {
            try
            {
                var seats = await _theaterHttpService.GetSeatsByRoomId(roomId);

                if (seats == null || !seats.Any())
                {
                    _logger.LogWarning("No seats found for RoomId: {RoomId}", roomId);
                    return NotFound("No seats found for the specified room.");
                }

                bool anyDeleted = false;

                foreach (var seat in seats)
                {
                    var result = await _repository.DeleteSchedule(movieId: movieId, date: date, time: time, seatId: seat.Id);
                    if (result)
                    {
                        anyDeleted = true;
                    }
                }

                if (anyDeleted)
                {
                    return Ok("Schedules deleted successfully.");
                }
                else
                {
                    return NotFound("No schedules found to delete for the specified criteria.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting schedules.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error occurred while deleting schedules.");
            }
        }
        [HttpGet("GetScheduleByMovieId/{movieId}")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetScheduleByMovieId(int movieId)
        {
            var movie = await _movieHttpService.GetMovieById(movieId);
            if (movie == null)
            {
                return NotFound();
            }

            var schedules = await _repository.GetSchedulesByMovieIdAsync(movieId);
            var scheduleMap = new Dictionary<string, Dictionary<int, TheaterScheduleDto>>();

            foreach (var schedule in schedules)
            {
                var seat = await _theaterHttpService.GetSeatById(schedule.SeatId);
                var room = (seat != null) ? await _theaterHttpService.GetRoomById(seat.RoomId) : null;
                var theater = (room != null) ? await _theaterHttpService.GetTheaterById(room.TheaterId) : null;
                var scheduleDate = schedule.Date.ToString("yyyy-MM-dd");

                if (!scheduleMap.ContainsKey(scheduleDate))
                {
                    scheduleMap[scheduleDate] = new Dictionary<int, TheaterScheduleDto>();
                }

                if (room != null && theater != null && !scheduleMap[scheduleDate].ContainsKey(theater.Id))
                {
                    scheduleMap[scheduleDate][theater.Id] = new TheaterScheduleDto
                    {
                        TheaterId = theater.Id,
                        TheaterName = theater.Name,
                        RoomSchedules = new Dictionary<int, RoomScheduleDto>()
                    };
                }

                var theaterSchedule = room != null && theater != null ? scheduleMap[scheduleDate][theater.Id] : null;

                if (room != null && theaterSchedule != null && !theaterSchedule.RoomSchedules.ContainsKey(room.Id))
                {
                    theaterSchedule.RoomSchedules[room.Id] = new RoomScheduleDto
                    {
                        RoomId = room.Id,
                        RoomName = room.Name,
                        Times = new List<string>()
                    };
                }

                var roomSchedule = theaterSchedule != null ? theaterSchedule.RoomSchedules[room.Id] : null;

                if (roomSchedule != null && !roomSchedule.Times.Contains(schedule.Time.ToString("HH:mm")))
                {
                    roomSchedule.Times.Add(schedule.Time.ToString("HH:mm"));
                }
            }

            var formattedSchedule = scheduleMap.Select(sm => new
            {
                Date = sm.Key,
                TheaterSchedules = sm.Value.Values.Select(ts => new
                {
                    ts.TheaterId,
                    ts.TheaterName,
                    RoomSchedules = ts.RoomSchedules.Values.Select(rs => new
                    {
                        rs.RoomId,
                        rs.RoomName,
                        Times = rs.Times
                    }).ToList()
                }).ToList()
            }).ToList();

            var result = new
            {
                Movie = new
                {
                    Id = movie.Id,
                    Title = movie.Title,
                    MovieUrl = movie.MovieUrl,
                },
                Schedules = formattedSchedule
            };

            return Ok(result);
        }

        [HttpGet("ByMovieId/{movieId}")]
        public async Task<IActionResult> ByMovieId(int movieId)
        {
            var schedules = await _repository.GetSchedulesByMovieIdAsync(movieId);

            if (schedules == null)
            {
                return NotFound(new { Message = $"No schedules found for MovieId {movieId}" });
            }

            return Ok(schedules);
        }
    }

    public class CreateScheduleInput
    {
        public int TheaterId { get; set; }
        public int RoomId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public int MovieId { get; set; }
    }

    public class TheaterScheduleDto
    {
        public int TheaterId { get; set; } // ID của rạp chiếu phim
        public string TheaterName { get; set; } // Tên của rạp chiếu phim
        public Dictionary<int, RoomScheduleDto> RoomSchedules { get; set; } // Danh sách lịch trình của các phòng chiếu trong rạp
    }

    public class RoomScheduleDto
    {
        public int RoomId { get; set; } // ID của phòng chiếu
        public string RoomName { get; set; } // Tên của phòng chiếu
        public List<string> Times { get; set; } // Danh sách các thời gian chiếu
    }
}
