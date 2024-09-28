using AutoMapper;
using EmployeeService.Dtos;
using EmployeeService.Models;

namespace EmployeeService.Profiles
{
    public class EmployeeProfile : Profile
    {
        public EmployeeProfile()
        {
            CreateMap<Employee, EmployeeReadDto>();
            CreateMap<EmployeeCreateDto, Employee>();
        }
    }
}
