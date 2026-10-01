using DigiCoupon.Application.ChatService;
using DigiCoupon.Application.Interfaces;
using DigiCoupon.Application.Interfaces.Auth;
using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Infrastructure.ChatService;
using DigiCoupon.Infrastructure.Persistence.Contexts;
using DigiCoupon.Infrastructure.Persistence.Interfaces;
using DigiCoupon.Infrastructure.Persistence.Repositories;
using DigiCoupon.Infrastrucure.Persistence.Auth;
using DigiCoupon.Infrastrucure.Persistence.Repositories;
using DigiCoupon.Infrastrucure.Persistence.Security;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Infrastrucure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection service, IConfiguration config)
        {
            service.AddHttpContextAccessor();
            service.AddDbContext<DigiCouponContext>(
                options =>
                {
                    options.UseSqlServer(config.GetConnectionString("Default")
            ).UseSnakeCaseNamingConvention();
                    options.EnableDetailedErrors();
                    options.EnableSensitiveDataLogging();
                });
            service.Configure<TokenSettings>(config.GetSection("JwtSettings"));
            service.AddScoped<IBase, Base>();
            service.AddScoped<ICurrentUser, CurrentUser>();
            service.AddScoped<ITokenProvider, TokenProvider>();
            service.AddScoped<IPasswordProvider, PasswordProvider>();
            service.AddScoped<IDapperContext, DapperContext>();
            service.AddScoped<IFileStorage, FileStorageContext>();
            service.AddScoped<IChatService, ChatService>();
            service.AddScoped<IUsers, Users>();
            service.AddScoped<IRestaurant, Restaurant>();
            service.AddScoped<IRestuarantBranches, RestuarantBranches>();
            service.AddScoped<ICustomers, Customers>();
            service.AddScoped<ICustomerCoupon, CustomerCoupon>();
            service.AddScoped<ICouponRedemption, CouponRedemptions>();
            service.AddScoped<IDashboard, Dashboards>();
            return service;
        }

    }
}
