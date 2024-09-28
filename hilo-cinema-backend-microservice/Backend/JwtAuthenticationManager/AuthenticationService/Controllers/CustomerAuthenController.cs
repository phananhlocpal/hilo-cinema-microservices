using JwtAuthenticationManager.Models;
using JwtAuthenticationManager;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AuthenticationService.Repositories;
using AuthenticationService.Dtos;
using AutoMapper;
using AuthenticationService.Models;
using AuthenticationService.Repositories.CustomerRepositories;

namespace AuthenticationService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAuthenController : ControllerBase
    {
        private readonly JwtTokenHandler _jwtTokenHandler;
        private readonly IMapper _mapper;
        private readonly ICustomerRepo _repository;
        private readonly ILogger<CustomerAuthenController> _logger;
        public CustomerAuthenController(JwtTokenHandler jwtTokenHandler, IMapper mapper, ICustomerRepo repository, ILogger<CustomerAuthenController> logger)
        {
            _jwtTokenHandler = jwtTokenHandler;
            _mapper = mapper;
            _repository = repository;
            _logger = logger;
        }

        [HttpPost]
        public ActionResult<AuthenticationResponse?> Authenticate([FromBody] AuthenticationRequest authencationRequest)
        {
            var authenticationResponse = _jwtTokenHandler.GenerateJwtToken(authencationRequest);
            if (authenticationResponse == null) return new AuthenticationResponse();
            return authenticationResponse;
        }
    }
}