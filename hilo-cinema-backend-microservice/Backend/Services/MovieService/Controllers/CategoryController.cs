using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieService.Data.ActorData;
using MovieService.Data.CategoryData;
using MovieService.Dtos.ActorDtos;
using MovieService.Dtos.CategoryDtos;
using MovieService.Dtos.MovieDtos;
using MovieService.Models;

namespace MovieService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController: ControllerBase
    {
        private readonly ICategoryRepo _repository;
        private readonly IMapper _mapper;

        public CategoryController(ICategoryRepo repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/Category
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CategoryReadDto>>> GetAllCategories()
        {
            var movies = await _repository.GetAllAsync();
            return Ok(_mapper.Map<IEnumerable<CategoryReadDto>>(movies));
        }

        // GET: api/Category/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CategoryReadDto>> GetCategoryById(int id)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            var categoryReadDto = _mapper.Map<CategoryReadDto>(category);

            return Ok(categoryReadDto);
        }

        // POST: api/movies
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<CategoryReadDto>> CreateCategory([FromBody] CategoryCreateDto categoryCreateDto)
        {
            var category = _mapper.Map<Category>(categoryCreateDto);

            await _repository.InsertAsync(category);
            var categoryReadDto = _mapper.Map<CategoryReadDto>(category);

            return CreatedAtAction(nameof(GetCategoryById), new { id = categoryReadDto.Id }, categoryReadDto);
        }

        // PUT: api/movies/{id} 
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryCreateDto categoryCreateDto)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _mapper.Map(categoryCreateDto, category);
            await _repository.UpdateAsync(category);

            return NoContent();
        }

        [HttpPut("{id}/disable")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> HideCategory(int id)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            await _repository.HideCategoryAsync(id);

            return NoContent();
        }
        [HttpGet("Count")]
        public async Task<ActionResult<int>> GetCategoryCount()
        {
            var count = await _repository.CountAsync();
            return Ok(count);
        }
    }
}
