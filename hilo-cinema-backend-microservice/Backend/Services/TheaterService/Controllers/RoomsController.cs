using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheaterService.Dtos;
using TheaterService.Models;

namespace TheaterService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly TheaterContext _context;
        private readonly IMapper _mapper;

        public RoomsController(TheaterContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomReadDto>>> GetRooms()
        {
            var rooms = await _context.Rooms.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<RoomReadDto>>(rooms));
        }
        [HttpGet("GetTheaterByRoomId/{roomId}")]
        [AllowAnonymous]
        public async Task<ActionResult<TheaterReadDto>> GetTheaterByRoomId(int roomId)
        {
            // Retrieve the room based on roomId
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Id == roomId);

            // Check if the room exists
            if (room == null)
            {
                return NotFound();
            }

            // Retrieve the theater based on the theaterId from the room
            var theater = await _context.Theaters.FirstOrDefaultAsync(t => t.Id == room.TheaterId);

            // Check if the theater exists
            if (theater == null)
            {
                return NotFound();
            }

            // Map and return the theater data
            return Ok(_mapper.Map<TheaterReadDto>(theater));
        }
        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomReadDto>> GetRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<RoomReadDto>(room));
        }

        // GET: api/Rooms/GetRoomByTheater/{theaterId}
        [HttpGet("GetRoomByTheater/{theaterId}")]
        public async Task<ActionResult<IEnumerable<RoomReadDto>>> GetRoomsByTheater(int theaterId)
        {
            var rooms = await _context.Rooms.Where(r => r.TheaterId == theaterId).ToListAsync();

            if (rooms == null || !rooms.Any())
            {
                return NotFound("No rooms found for this theater.");
            }

            return Ok(_mapper.Map<IEnumerable<RoomReadDto>>(rooms));
        }

        // PUT: api/Rooms/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(int id, RoomCreateDto roomDto)
        {

            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _mapper.Map(roomDto, room);
            _context.Entry(room).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
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

        // POST: api/Rooms
        [HttpPost]
        public async Task<ActionResult<RoomReadDto>> PostRoom(RoomCreateDto roomDto)
        {
            var room = _mapper.Map<Room>(roomDto);
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            var roomReadDto = _mapper.Map<RoomReadDto>(room);

            return CreatedAtAction("GetRoom", new { id = roomReadDto.Id }, roomReadDto);
        }

        // DELETE: api/Rooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}
