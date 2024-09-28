using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SaleService.Dtos;
using SaleService.Models;
using SaleService.Repositories.FoodRepository;

namespace SaleService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodController : ControllerBase
    {
        private readonly IFoodRepo _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<FoodController> _logger;

        public FoodController(
            IFoodRepo repository,
            IMapper mapper,
            ILogger<FoodController> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FoodReadDto>>> GetAllFoods()
        {
            try
            {
                var foods = await _repository.GetAllFoodAsync();
                var foodReadDtos = _mapper.Map<IEnumerable<FoodReadDto>>(foods);
                return Ok(foodReadDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all foods");
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error getting all foods. {ex}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FoodReadDto>> GetFoodById(int id)
        {
            try
            {
                var food = await _repository.GetFoodByIdAsync(id);
                if (food == null)
                {
                    return NotFound();
                }

                var foodReadDto = _mapper.Map<FoodReadDto>(food);
                return Ok(foodReadDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting food by id");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error getting food by id");
            }
        }

        [HttpPost]
        public async Task<ActionResult<FoodReadDto>> CreateFood(FoodCreateDto foodCreateDto)
        {
            try
            {
                var food = _mapper.Map<Models.Food>(foodCreateDto);
                var createdFood = await _repository.CreateFoodAsync(food);

                var foodReadDto = _mapper.Map<FoodReadDto>(createdFood);
                return CreatedAtAction(nameof(GetFoodById), new { id = foodReadDto.Id }, foodReadDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating food");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating food");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateFood(int id, FoodCreateDto foodCreateDto)
        {
            try
            {
                var existingFood = await _repository.GetFoodByIdAsync(id);
                if (existingFood == null)
                {
                    return NotFound();
                }

                var updatedFood = _mapper.Map<Models.Food>(foodCreateDto);
                updatedFood.Id = id;

                await _repository.UpdateFoodAsync(updatedFood);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating food");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating food");
            }
        }
    }
}
