using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using MovieService.Data.MovieData;
using MovieService.Models;
using MovieService.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;
using MovieService.Dtos.MovieDtos;
using Microsoft.AspNetCore.Authorization;
using MovieService.Data.ProducerData;
using MovieService.Dtos.ProducerDtos;
using MovieService.Dtos.ActorDtos;

namespace MovieService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProducerController : ControllerBase
    {
        private readonly IProducerRepo _repository;
        private readonly IMapper _mapper;

        public ProducerController(IProducerRepo repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/movies
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProducerReadDto>>> GetAllProducer()
        {
            var producers = await _repository.GetAllAsync();
            return Ok(_mapper.Map<IEnumerable<ProducerReadDto>>(producers));
        }

        // GET: api/movies/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ProducerReadDto>> GetProducerById(int id)
        {
            var producer = await _repository.GetByIdAsync(id);
            if (producer == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<ProducerReadDto>(producer));
        }

        // POST: api/movies
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<ProducerReadDto>> CreateProducer([FromForm] ProducerCreateDto producerCreateDto)
        {
            var producer = _mapper.Map<Producer>(producerCreateDto);

            if (producerCreateDto.Img != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await producerCreateDto.Img.CopyToAsync(memoryStream);
                    producer.Img = memoryStream.ToArray();
                }
            }

            await _repository.InsertAsync(producer, producerCreateDto.MovieIds); // Bao gồm movieIds ở đây
            var producerReadDto = _mapper.Map<ProducerReadDto>(producer);
            return CreatedAtAction(nameof(GetProducerById), new { id = producerReadDto.Id }, producerReadDto);
        }
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateProducer(int id, [FromForm] ProducerCreateDto producerCreateDto)
        {
            var actor = await _repository.GetByIdAsync(id);
            if (actor == null)
            {
                return NotFound();
            }

            // Map other properties from DTO to the entity
            _mapper.Map(producerCreateDto, actor);

            // Only update the image if a new one is provided
            if (producerCreateDto.Img != null && producerCreateDto.Img.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await producerCreateDto.Img.CopyToAsync(memoryStream);
                    actor.Img = memoryStream.ToArray();
                }
            }

            await _repository.UpdateAsync(actor, producerCreateDto.MovieIds); // Truyền danh sách movieIds
            return NoContent();
        }

        [HttpGet("GetProducerByMovieId/{movieId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProducerReadDto>>> GetProducerByMovieId(int movieId)
        {
            var producers = await _repository.GetProducersByMovieIdAsync(movieId);
            if (producers == null || !producers.Any())
            {
                return NotFound();
            }
            return Ok(_mapper.Map<IEnumerable<ProducerReadDto>>(producers));
        }


        [HttpPut("{id}/disable")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> HideProducer(int id)
        {
            var producer = await _repository.GetByIdAsync(id);
            if (producer == null)
            {
                return NotFound();
            }

            await _repository.HiddenProducerAsync(id);

            return NoContent();
        }
    }
}