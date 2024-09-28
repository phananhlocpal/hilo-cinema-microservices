using AuthenticationService.Dtos.Employee;
using AutoMapper;

namespace AuthenticationService.Profiles
{
    public class EmployeeProfile : Profile
    {
        public EmployeeProfile() {
            CreateMap<Profile, RegisterEmployeeDTO>();
        }

    }
}
