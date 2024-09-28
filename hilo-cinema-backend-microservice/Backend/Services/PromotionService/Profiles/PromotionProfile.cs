using AutoMapper;
using PromotionService.Dtos;
using PromotionService.Models;

namespace PromotionService.Profiles
{
    public class PromotionProfile : Profile
    {
        public PromotionProfile()
        {
            CreateMap<Promotion, PromotionReadDTO>();
            CreateMap<PromotionCreateDTO, Promotion>();
        }
    }
}
