using AuthenticationService.Dtos;
using AuthenticationService.Models;
using AutoMapper;

namespace AuthenticationService.Profiles
{
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            CreateMap<Customer, RegisterDTO>();
        }
    }
}
