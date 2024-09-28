using AutoMapper;
using ScheduleService.Dtos;
using ScheduleService.Models;

namespace ScheduleService.Profiles
{
    public class SchedulesProfile : Profile
    {
        public SchedulesProfile()
        {
            CreateMap<Schedule, ScheduleReadDto>()
                .ForMember(dest => dest.Movie, opt => opt.Ignore());
            CreateMap<Schedule, ScheduleReadDto>();
        }
    }
}
