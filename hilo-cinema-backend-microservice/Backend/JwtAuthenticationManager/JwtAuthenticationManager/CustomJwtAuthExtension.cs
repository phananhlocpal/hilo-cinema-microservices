using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtAuthenticationManager
{
    public static class CustomJwtAuthExtension
    {
        public const string JWT_SECURITY_KEY = "yPkCqn4kSWLtaJwXvN2jGzQRyTZ3gdXkt7FeBJP";
        public static void AddCustomJwtAuthentication(this IServiceCollection services)
        {
            services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.RequireHttpsMetadata = false;
                o.SaveToken = true;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(JWT_SECURITY_KEY)),
                    ValidateLifetime = true,
                };
            });

            services.AddAuthorization(options =>
            {
                // Policy cho AdminOnly
                options.AddPolicy("AdminOnly", policy =>
                     policy.RequireClaim("Site", "admin")
                           .RequireClaim("Role", "admin"));

                // Policy cho AdminEmployeeOnly (Chỉ dành cho admin và employee)
                options.AddPolicy("AdminEmployeeOnly", policy =>
                    policy.RequireClaim("Site", "admin"));
            });
        }
    }
}
