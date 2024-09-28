using Microsoft.EntityFrameworkCore;
using MovieService.Data.MovieData;
using MovieService.Models;
using JwtAuthenticationManager;
using AutoMapper;
using MovieService.Data.ActorData;
using MovieService.Data.ProducerData;
using MovieService.Data.CategoryData;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<MovieContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));  
builder.Services.AddScoped<IMovieRepo, MovieRepo>();
builder.Services.AddScoped<IActorRepo, ActorRepo>();
builder.Services.AddScoped<IProducerRepo, ProducerRepo>();
builder.Services.AddScoped<ICategoryRepo, CategoryRepo>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddCustomJwtAuthentication();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:1000") // Update this URL to match your React app's URL
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

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
