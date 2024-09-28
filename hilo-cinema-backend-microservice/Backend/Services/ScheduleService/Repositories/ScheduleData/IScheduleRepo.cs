using ScheduleService.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ScheduleService.Repositories.ScheduleRepository
{
    public interface IScheduleRepo
    {
        Task<IEnumerable<Schedule>> GetAllScheduleAsync();
        Task<Schedule> GetScheduleByCriteriaAsync(int? movieId = null, DateOnly? date = null, TimeOnly? time = null, int? seatId = null);
        Task<IEnumerable<Schedule>> GetSchedulesByMovieIdAsync(int movieId);
        Task<IEnumerable<Schedule>> GetScheduleByInvoiceIdAsync(int invoiceId);
        Task<IEnumerable<Schedule>> GetSeatsBySchedude(int movieId, DateOnly date, int theaterId, int roomId, TimeOnly time);
        Task<Schedule> CreateScheduleAsync(Schedule schedule);
        Task<List<int>> GetSeatsForScheduleAsync(Schedule schedule);
        Task<Schedule> UpdateScheduleAsync(Schedule schedule);
        Task CreateSchedulesAsync(IEnumerable<Schedule> schedules);
        Task<bool> DeleteSchedule(int movieId, DateOnly date, TimeOnly time, int seatId);
        Task<bool> SaveChangesAsync();
    }
}
