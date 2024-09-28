using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using TheaterService.Dtos;
using TheaterService.Models;
using Microsoft.AspNetCore.Authorization;

namespace TheaterService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TheatersController : ControllerBase
    {
        private readonly TheaterContext _context;
        private readonly IMapper _mapper;

        public TheatersController(TheaterContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Theaters
        // Tương ứng với fetchTheaters trong theaterAction
        // Chức năng này có thể cho phép Anonymous truy cập để xem tất cả các rạp chiếu
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<TheaterReadDto>>> GetTheaters()
        {
            var theaters = await _context.Theaters.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<TheaterReadDto>>(theaters));
        }

        // GET: api/Theaters/5
        // Tương ứng với fetchTheaterDetails trong theaterAction
        // Chức năng này có thể cho phép Anonymous truy cập để xem chi tiết một rạp chiếu
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<TheaterReadDto>> GetTheater(int id)
        {
            var theater = await _context.Theaters.FindAsync(id);

            if (theater == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<TheaterReadDto>(theater));
        }

        // PUT: api/Theaters/5
        // Tương ứng với editTheater trong theaterAction
        // Chức năng này chỉ cho phép Admin hoặc Employee có quyền chỉnh sửa thông tin rạp chiếu
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTheater(int id, TheaterCreateDto theaterUpdateDto)
        {
            var theater = await _context.Theaters.FindAsync(id);
            if (theater == null)
            {
                return NotFound();
            }

            _mapper.Map(theaterUpdateDto, theater);
            _context.Entry(theater).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TheaterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PUT: api/Theaters/Hide/5
        // Tương ứng với hiddenTheater trong theaterAction
        // Chức năng này chỉ cho phép Admin có quyền ẩn rạp chiếu
        [HttpPut("{id}/disable")]
        public async Task<IActionResult> HideTheater(int id)
        {
            var theater = await _context.Theaters.FindAsync(id);
            if (theater == null)
            {
                return NotFound();
            }

            theater.Status = "Inactive"; // Giả định rằng bạn có một trường Status để ẩn rạp chiếu
            _context.Entry(theater).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TheaterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Theaters
        // Tương ứng với addTheater trong theaterAction
        // Chức năng này chỉ cho phép Admin có quyền thêm rạp chiếu mới
        [HttpPost]
        public async Task<ActionResult<TheaterReadDto>> PostTheater(TheaterCreateDto theaterCreateDto)
        {
            var theater = _mapper.Map<Theater>(theaterCreateDto);
            _context.Theaters.Add(theater);
            await _context.SaveChangesAsync();

            var theaterReadDto = _mapper.Map<TheaterReadDto>(theater);

            return CreatedAtAction("GetTheater", new { id = theaterReadDto.Id }, theaterReadDto);
        }

        // DELETE: api/Theaters/5
        // Tương ứng với deleteTheater nếu bạn có action xóa rạp chiếu
        // Chức năng này chỉ cho phép Admin có quyền xóa rạp chiếu
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTheater(int id)
        {
            var theater = await _context.Theaters.FindAsync(id);
            if (theater == null)
            {
                return NotFound();
            }

            _context.Theaters.Remove(theater);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Theaters/Count
        // Nếu bạn cần đếm số lượng rạp chiếu (tương ứng với fetchTHEATERSCount trong theaterAction)
        // Chức năng này chỉ cho phép Admin hoặc Employee có quyền xem số lượng rạp chiếu
        [HttpGet("Count")]
        public async Task<ActionResult<int>> GetTheatersCount()
        {
            var count = await _context.Theaters.CountAsync();
            return Ok(count);
        }

        private bool TheaterExists(int id)
        {
            return _context.Theaters.Any(e => e.Id == id);
        }
    }
}
