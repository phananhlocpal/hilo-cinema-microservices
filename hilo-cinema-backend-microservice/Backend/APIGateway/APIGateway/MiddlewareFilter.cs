using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace APIGateway
{
    public class MiddlewareFilter
    {
        private readonly RequestDelegate _next;

        public MiddlewareFilter(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var siteType = context.Request.Headers["Site-Type"].FirstOrDefault();

            if (siteType == "admin")
            {
                // Check if token is provided and valid
                if (!context.Request.Headers.ContainsKey("Authorization"))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Token is required");
                    return;
                }

                var token = context.Request.Headers["Authorization"].ToString();
                if (!IsValidToken(token))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Invalid token");
                    return;
                }
            }

            await _next(context);
        }

        private bool IsValidToken(string token)
        {
            // Implement token validation logic here
            return true; // Replace with actual validation
        }
    }

    public static class SiteTypeMiddlewareExtensions
    {
        public static IApplicationBuilder UseSiteTypeMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<MiddlewareFilter>();
        }
    }
}
