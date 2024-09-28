using Microsoft.EntityFrameworkCore;
using ScheduleService.Repositories.ScheduleRepository;
using ScheduleService.Models;
using ScheduleService.Service.HttpServices;
using ScheduleService.Service.MessagerBrokerServices;
using MessageBrokerService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register HttpClient for MovieService
builder.Services.AddHttpClient("MovieService", client =>
{
    client.BaseAddress = new Uri("https://localhost:5001/api/Movies/");
});

builder.Services.AddHttpClient("SeatService", client =>
{
    client.BaseAddress = new Uri("http://localhost:5002/api/Seats/"); 
});

builder.Services.AddHttpClient("TheaterService", client =>
{
    client.BaseAddress = new Uri("http://localhost:5002/api/Theaters/"); 
});

builder.Services.AddHttpClient("RoomService", client =>
{
    client.BaseAddress = new Uri("http://localhost:5002/api/Rooms/"); 
});
builder.Services.AddHttpClient("InvoiceService", client =>
{
    client.BaseAddress = new Uri("http://localhost:5004/api/Invoice/"); 
});

// Configure database context
builder.Services.AddDbContext<ScheduleContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Register repositories and services
builder.Services.AddScoped<IScheduleRepo, ScheduleRepo>();
builder.Services.AddScoped<MovieHttpService>();
builder.Services.AddScoped<TheaterHttpService>();
builder.Services.AddScoped<InvoiceHttpService>();

// Register singleton services
builder.Services.AddSingleton<BaseMessageBroker>();
builder.Services.AddSingleton<ScheduleConsumerService>();
builder.Services.AddSingleton<IHostedService>(provider => provider.GetRequiredService<ScheduleConsumerService>());

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAny",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAny");
app.UseAuthorization();
app.MapControllers();
app.Run();
