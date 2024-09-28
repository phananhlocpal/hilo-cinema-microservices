using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using MovieService.Data.MovieData;
using MovieService.Models;
using MovieService.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;
using MovieService.Dtos.MovieDtos;
using Microsoft.AspNetCore.Authorization;

namespace MovieService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieRepo _repository;
        private readonly IMapper _mapper;

        public MoviesController(IMovieRepo repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/movies
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MovieReadDto>>> GetAllMovies()
        {
            var movies = await _repository.GetAllAsync(m => m.Status == "Active");
            var movieDtos = movies.Select(movie =>
            {
                var movieDto = _mapper.Map<MovieReadDto>(movie);
                movieDto.ImgSmall = movie.ImgSmall != null ? Convert.ToBase64String(movie.ImgSmall) : null;
                movieDto.ImgLarge = movie.ImgLarge != null ? Convert.ToBase64String(movie.ImgLarge) : null;
                return movieDto;
            }).ToList();

            return Ok(movieDtos);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<MovieReadDto>> GetMovieById(int id)
        {
            var movie = await _repository.GetByIdAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            var movieDto = _mapper.Map<MovieReadDto>(movie);
            movieDto.ImgSmall = movie.ImgSmall != null ? Convert.ToBase64String(movie.ImgSmall) : null;
            movieDto.ImgLarge = movie.ImgLarge != null ? Convert.ToBase64String(movie.ImgLarge) : null;

            return Ok(movieDto);
        }


        // GET: api/movies/url/{url}
        [HttpGet("url/{url}")]
        [AllowAnonymous]
        public async Task<ActionResult<MovieReadDto>> GetMovieByUrl(string url)
        {
            var movie = await _repository.GetByUrlAsync(url);
            if (movie == null)
            {
                return NotFound();
            }

            var movieDto = _mapper.Map<MovieReadDto>(movie);
            movieDto.ImgSmall = movie.ImgSmall != null ? Convert.ToBase64String(movie.ImgSmall) : null;
            movieDto.ImgLarge = movie.ImgLarge != null ? Convert.ToBase64String(movie.ImgLarge) : null;

            return Ok(movieDto);
        }

        // POST: api/movies
        [HttpPost]
        public async Task<ActionResult<MovieReadDto>> CreateMovie([FromForm] MovieCreateDto movieCreateDto)
        {
            // Iformfile - base 64

            var movieModel = _mapper.Map<Movie>(movieCreateDto);

            if (movieCreateDto.ImgSmall != null && movieCreateDto.ImgSmall.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await movieCreateDto.ImgSmall.CopyToAsync(memoryStream);
                    movieModel.ImgSmall = memoryStream.ToArray();
                }
            }

            if (movieCreateDto.ImgLarge != null && movieCreateDto.ImgLarge.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await movieCreateDto.ImgLarge.CopyToAsync(memoryStream);
                    movieModel.ImgLarge = memoryStream.ToArray();
                }
            }

            await _repository.InsertAsync(movieModel);
            var movieReadDto = _mapper.Map<MovieReadDto>(movieModel);

            return CreatedAtAction(nameof(GetMovieById), new { id = movieReadDto.Id }, movieReadDto);
        }


        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateMovie(int id, [FromForm] MovieCreateDto movieCreateDto)
        {
            var movieModel = await _repository.GetByIdAsync(id);
            if (movieModel == null)
            {
                return NotFound();
            }

            _mapper.Map(movieCreateDto, movieModel);

            if (movieCreateDto.ImgSmall != null && movieCreateDto.ImgSmall.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await movieCreateDto.ImgSmall.CopyToAsync(memoryStream);
                    movieModel.ImgSmall = memoryStream.ToArray();
                }
            }

            if (movieCreateDto.ImgLarge != null && movieCreateDto.ImgLarge.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await movieCreateDto.ImgLarge.CopyToAsync(memoryStream);
                    movieModel.ImgLarge = memoryStream.ToArray();
                }
            }

            await _repository.UpdateAsync(movieModel);

            return NoContent();
        }




        [HttpPut("{id}/disable")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> HideMovie(int id)
        {
            var movie = await _repository.GetByIdAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            await _repository.DisableMovieAsync(id);

            return NoContent();
        }
        [HttpGet("count")]
        [AllowAnonymous]
        public async Task<ActionResult<int>> GetMovieCount()
        {
            try
            {
                var count = await _repository.GetMovieCountAsync();
                return Ok(count);
            }
            catch (Exception ex)
            {
               
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
