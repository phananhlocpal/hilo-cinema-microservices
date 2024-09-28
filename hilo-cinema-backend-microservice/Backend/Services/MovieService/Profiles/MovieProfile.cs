using AutoMapper;
using MovieService.Dtos.ActorDtos;
using MovieService.Dtos.CategoryDtos;
using MovieService.Dtos.MovieDtos;
using MovieService.Dtos.ProducerDtos;
using MovieService.Models;

namespace MovieService.Profiles
{
    public class MoviesProfile : Profile
    {
        public MoviesProfile()
        {
            CreateMap<Movie, MovieReadDto>();

            CreateMap<MovieCreateDto, Movie>()
                .ForMember(dest => dest.ImgSmall, opt => opt.Ignore()) // Handle image separately
                .ForMember(dest => dest.ImgLarge, opt => opt.Ignore()); // Handle image separately

            CreateMap<ActorCreateDto, Actor>()
                .ForMember(dest => dest.Img, opt => opt.Ignore()) // Handle image separately
                .ForMember(dest => dest.Movies, opt => opt.Ignore()); // Handle movie relationship as needed

            CreateMap<Actor, ActorReadDto>();

            CreateMap<Category, CategoryReadDto>();
            CreateMap<CategoryCreateDto, Category>();

            CreateMap<Producer, ProducerReadDto>();

            CreateMap<ProducerCreateDto, Producer>()
                .ForMember(dest => dest.Img, opt => opt.Ignore());  // Handle image separately
        }
    }
}
