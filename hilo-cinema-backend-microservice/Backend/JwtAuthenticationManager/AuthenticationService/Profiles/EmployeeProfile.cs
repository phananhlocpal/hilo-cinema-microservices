using AutoMapper;
using AuthenticationService.Dtos;
using AuthenticationService.Models;

namespace AuthenticationService.Profiles
{
    public class EmployeeProfile : Profile
    {
        public EmployeeProfile()
        {
            CreateMap<EmployeeCreateDto, Employee>();
            CreateMap<Employee, EmployeeReadDto>();
        }
    }
}
