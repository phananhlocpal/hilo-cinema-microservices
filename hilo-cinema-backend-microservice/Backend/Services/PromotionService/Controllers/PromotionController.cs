using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PromotionService.Data;
using PromotionService.Dtos;
using PromotionService.Models;
using System.Net;

namespace PromotionService.Controllers
{
    [Route("api/PromotionService")]
    [ApiController]
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionRepository _repository;
        private readonly IMapper _mapper;

        public PromotionController(IPromotionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        

    }
}
