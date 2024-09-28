using AutoMapper;
using TheaterService.Dtos;
using TheaterService.Models;

namespace TheaterService.Profiles
{
    public class TheaterProfile : Profile
    {
        public TheaterProfile()
        {
            // Source -> Target
            CreateMap<TheaterReadDto, Theater>();
            CreateMap<Theater, TheaterReadDto>();
            CreateMap<TheaterCreateDto, Theater>();
            CreateMap<Room, RoomReadDto>();
            CreateMap<RoomCreateDto, Room>();
            CreateMap<Seat, SeatReadDto>();
            CreateMap<SeatCreateDto, Seat>();
        }
    }
}
