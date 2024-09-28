using AuthenticationService.Dtos;
using AuthenticationService.Helper;
using AuthenticationService.Models;
using AuthenticationService.Repositories;
using AuthenticationService.Repositories.EmployeeRepositories;
using AutoMapper;
using JwtAuthenticationManager;
using JwtAuthenticationManager.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Azure.Core.HttpHeader;

namespace AuthenticationService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeAuthenController : ControllerBase
    {

        private readonly JwtTokenHandlerEmp _jwtTokenHandler;
        private readonly IEmployeeRepo _employeeRepo;
        private readonly IMapper _mapper;

        public EmployeeAuthenController(JwtTokenHandlerEmp jwtTokenHandler, IEmployeeRepo employeeRepo, IMapper mapper)
        {
            _jwtTokenHandler = jwtTokenHandler;
            _employeeRepo = employeeRepo;
            _mapper = mapper;
        }

        [HttpPost]
        public ActionResult<AuthenticationEmpResponse?> Authenticate([FromBody] AuthenticationEmpRequest authencationRequest)
        {
            var authenticationResponse = _jwtTokenHandler.GenerateJwtToken(authencationRequest);
            if (authenticationResponse == null) return Unauthorized();
            return authenticationResponse;

        }
    }
}
