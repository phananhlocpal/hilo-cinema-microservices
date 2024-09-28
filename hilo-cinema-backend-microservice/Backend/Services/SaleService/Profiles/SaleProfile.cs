using AutoMapper;
using SaleService.Dtos;
using SaleService.Models;

namespace SaleService.Profiles
{
    public class SaleProfile : Profile
    {
        public SaleProfile()
        {
            CreateMap<InvoiceCreateDto, Invoice>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // Id sẽ được tạo tự động bởi DB
                .ForMember(dest => dest.InvoiceFoods, opt => opt.MapFrom(src => src.InvoiceFoods)); // Mapping InvoiceFoods nếu cần

            CreateMap<Invoice, InvoiceReadDto>();

            CreateMap<Models.Food, FoodReadDto>();
            CreateMap<FoodCreateDto, Models.Food>();



        }
    }
}
