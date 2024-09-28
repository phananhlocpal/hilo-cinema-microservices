using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Configuration;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using JwtAuthenticationManager;

var builder = WebApplication.CreateBuilder(args);

// Configuration setup
IConfiguration configuration = new ConfigurationBuilder()
    .AddJsonFile("ocelot.json") // Ensure you have an ocelot.json file configured
    .Build();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

// Add Ocelot services to DI
builder.Services.AddOcelot(configuration);
builder.Services.AddCustomJwtAuthentication();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API Gateway", Version = "v1" });
});

var app = builder.Build();

// Configure CORS
app.UseCors();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    // Enable Swagger UI for development purposes
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API Gateway v1");
    });
}

// Other middleware configurations
app.UseHttpsRedirection();
app.UseRouting();

// Use Ocelot middleware
await app.UseOcelot();
app.UseAuthentication();
app.UseAuthorization();


// Map controllers
app.MapControllers();

// Start the application
app.Run();
