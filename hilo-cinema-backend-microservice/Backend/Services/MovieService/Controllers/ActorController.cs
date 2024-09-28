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
using MovieService.Data.ActorData;
using MovieService.Dtos.ActorDtos;

namespace MovieService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActorController : ControllerBase
    {
        private readonly IActorRepo _repository;
        private readonly IMapper _mapper;

        public ActorController(IActorRepo repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/movies
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ActorReadDto>>> GetAllProducer()
        {
            var actors = await _repository.GetAllAsync();
            return Ok(_mapper.Map<IEnumerable<ActorReadDto>>(actors));
        }

        // GET: api/actors/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ActorReadDto>> GetActorById(int id)
        {
            var actor = await _repository.GetByIdAsync(id);
            if (actor == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<ActorReadDto>(actor));
        }

        // POST: api/actor
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<ActorReadDto>> CreateActor([FromForm] ActorCreateDto actorCreateDto)
        {
            var actor = _mapper.Map<Actor>(actorCreateDto);

            if (actorCreateDto.Img != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await actorCreateDto.Img.CopyToAsync(memoryStream);
                    actor.Img = memoryStream.ToArray();
                }
            }

            await _repository.InsertAsync(actor, actorCreateDto.MovieIds); // Bao gồm movieIds ở đây
            var actorReadDto = _mapper.Map<ActorReadDto>(actor);
            return CreatedAtAction(nameof(GetActorById), new { id = actorReadDto.Id }, actorReadDto);
        }
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateActor(int id, [FromForm] ActorCreateDto actorCreateDto)
        {
            var actor = await _repository.GetByIdAsync(id);
            if (actor == null)
            {
                return NotFound();
            }

            // Map other properties from DTO to the entity
            _mapper.Map(actorCreateDto, actor);

            // Only update the image if a new one is provided
            if (actorCreateDto.Img != null && actorCreateDto.Img.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await actorCreateDto.Img.CopyToAsync(memoryStream);
                    actor.Img = memoryStream.ToArray();
                }
            }

            await _repository.UpdateAsync(actor, actorCreateDto.MovieIds); // Truyền danh sách movieIds
            return NoContent();
        }
        [HttpGet("GetActorByMovieId/{movieId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ActorReadDto>>> GetActorsByMovieId(int movieId)
        {
            var actors = await _repository.GetActorsByMovieIdAsync(movieId);
            if (actors == null || !actors.Any())
            {
                return NotFound();
            }
            return Ok(_mapper.Map<IEnumerable<ActorReadDto>>(actors));
        }
        [HttpPut("{id}/disable")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> HideActor(int id)
        {
            var producer = await _repository.GetByIdAsync(id);
            if (producer == null)
            {
                return NotFound();
            }

            await _repository.HideActor(id);

            return NoContent();
        }
    }
}
