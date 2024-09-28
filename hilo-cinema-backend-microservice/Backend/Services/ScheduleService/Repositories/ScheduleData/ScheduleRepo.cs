using ScheduleService.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScheduleService.Repositories.ScheduleRepository
{
    public class ScheduleRepo : IScheduleRepo
    {
        private readonly ScheduleContext _context;

        public ScheduleRepo(ScheduleContext context)
        {
            _context = context;
        }

        public async Task<Schedule> CreateScheduleAsync(Schedule schedule)
        {
            if (schedule == null)
            {
                throw new ArgumentNullException(nameof(schedule));
            }
            await _context.Schedules.AddAsync(schedule);
            await _context.SaveChangesAsync();
            return schedule;  
        }


        public async Task<IEnumerable<Schedule>> GetAllScheduleAsync()
        {
            return await _context.Schedules.ToListAsync();
        }

        public async Task<Schedule> GetScheduleByCriteriaAsync(int? movieId = null, DateOnly? date = null, TimeOnly? time = null, int? seatId = null)
        {
            var query = _context.Schedules.AsQueryable();

            if (movieId.HasValue)
            {
                query = query.Where(s => s.MovieId == movieId.Value);
            }

            if (date.HasValue)
            {
                query = query.Where(s => s.Date == date.Value);
            }

            if (time.HasValue)
            {
                query = query.Where(s => s.Time == time.Value);
            }
            if (seatId.HasValue)
            {
                query = query.Where(s => s.SeatId == seatId.Value);
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Schedule>> GetSeatsBySchedude(int movieId, DateOnly date, int theaterId, int roomId, TimeOnly time)
        {
            var query = await _context.Schedules
                .Where(s=> s.MovieId == movieId && s.Date == date && s.Time == time)
                .ToListAsync();
            return query;
        }

        public async Task<IEnumerable<Schedule>> GetScheduleByInvoiceIdAsync(int invoiceId)
        {
            var query = await _context.Schedules
                .Where(s => s.InvoiceId == invoiceId)
                .ToListAsync();
            return query;
        }

        public async Task<IEnumerable<Schedule>> GetSchedulesByMovieIdAsync(int movieId)
        {
            var query = await _context.Schedules
                .Where(s => s.MovieId == movieId)
                .ToListAsync();

            return query;
        }
        public async Task<List<int>> GetSeatsForScheduleAsync(Schedule schedule)
        {
            // Fetch all seats associated with a specific schedule
            var seatIds = await _context.Schedules
                .Where(ss => ss.MovieId == schedule.MovieId && ss.Date == schedule.Date && ss.Time == schedule.Time)
                .Select(ss => ss.SeatId)
                .ToListAsync();

            return seatIds;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() >= 0;
        }

        public async Task<Schedule> UpdateScheduleAsync(Schedule schedule)
        {
            if (schedule == null)
            {
                throw new ArgumentNullException(nameof(schedule));
            }

            // Find the existing schedule in the database using the composite key
            var existingSchedule = await _context.Schedules
                .FirstOrDefaultAsync(s =>
                    s.MovieId == schedule.MovieId &&
                    s.Date == schedule.Date &&
                    s.Time.Hour == schedule.Time.Hour &&
                    s.Time.Minute == schedule.Time.Minute &&
                    s.SeatId == schedule.SeatId);

            if (existingSchedule == null)
            {
                // Handle the case where the schedule to update does not exist
                throw new KeyNotFoundException($"Schedule with MovieId {schedule.MovieId}, Date {schedule.Date}, Time {schedule.Time}, and SeatId {schedule.SeatId} not found.");
            }

            // Update the existing schedule with the new values
            existingSchedule.InvoiceId = schedule.InvoiceId;
            // Update other properties as needed

            // Save changes to the database
            await _context.SaveChangesAsync();

            return existingSchedule;
        }

        public async Task<bool> DeleteSchedule(int movieId, DateOnly date, TimeOnly time, int seatId)
        {
            try
            {
                var schedule = await _context.Schedules
                    .Where(s => s.MovieId == movieId && s.Date == date && s.Time == time && s.SeatId == seatId)
                    .FirstOrDefaultAsync();

                if (schedule == null)
                {
                    return false; 
                }

                _context.Schedules.Remove(schedule);
                await _context.SaveChangesAsync();

                return true; 
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public async Task CreateSchedulesAsync(IEnumerable<Schedule> schedules)
        {
            _context.Schedules.AddRange(schedules);
            await _context.SaveChangesAsync();
        }
    }
}
