using Microsoft.EntityFrameworkCore;
using SaleService.Models;
using SaleService.Repositories.FoodRepository;
using SaleService.Repositories.InvoiceFoodRepository;
using SaleService.Repositories.InvoiceRepository;
using SaleService.Service.RabbitMQServices;
using SaleService.Services.VNPayService;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using SaleService.Services.HttpServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Register distributed Redis cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379";
    options.InstanceName = "SaleServiceSession";
});

// Configure session to use Redis
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.Name = "SaleServiceSession";
    // Optionally set other session options here
});

// Register DbContext
builder.Services.AddDbContext<SaleContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register HttpClient
builder.Services.AddHttpClient("ScheduleService", client =>
{
    client.BaseAddress = new Uri("http://localhost:5003/api/Schedule/");
});
builder.Services.AddHttpClient("EmployeeService", client =>
{
    client.BaseAddress = new Uri("https://localhost:5006/api/Employee/");
});
builder.Services.AddHttpClient("CustomerService", client =>
{
    client.BaseAddress = new Uri("https://localhost:5005/api/Customer/");
});
builder.Services.AddHttpClient("SeatService", client =>
{
    client.BaseAddress = new Uri("http://localhost:5002/api/Seats/");
});
builder.Services.AddHttpClient("MovieService", client =>
{
    client.BaseAddress = new Uri("https://localhost:5001/api/Movies/");
});

// Register AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Register repositories
builder.Services.AddScoped<IFoodRepo, FoodRepo>();
builder.Services.AddScoped<IInvoiceFoodRepo, InvoiceFoodRepo>();
builder.Services.AddScoped<IInvoiceRepo, InvoiceRepo>();
// Register services
builder.Services.AddSingleton<IVnPayService, VnPayService>();
builder.Services.AddScoped<SalePublisherService>();
builder.Services.AddScoped<ScheduleHttpService>();
builder.Services.AddScoped<EmployeeHttpService>();
builder.Services.AddScoped<CustomerHttpService>();
builder.Services.AddScoped<MovieHttpService>();
builder.Services.AddScoped<TheaterHttpService>();
// Register HttpContextAccessor
builder.Services.AddHttpContextAccessor();

builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SaleService API V1");
    c.RoutePrefix = string.Empty; // Adjust as needed
});


app.UseHttpsRedirection();
app.UseCors();
app.UseSession();
app.UseRouting();
app.UseAuthentication(); // Add this if you have authentication
app.UseAuthorization();
app.MapControllers();

app.Run();
