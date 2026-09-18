
using DigiCoupon.Application.Interfaces.Services;
using DigiCoupon.Application.Services;

using Microsoft.Extensions.DependencyInjection;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application
{
    public static class DependencyRegistration
    {
        public static IServiceCollection AddApplication(this IServiceCollection service)
        {
            service.AddScoped<IUserService, UserService>();
            service.AddScoped<IRestaurantService, RestuarantService>();
            service.AddScoped<IRestaurantBranchService, RestuarantBranchService>();
            service.AddScoped<ICustomerService, CustomerService>();
            return service;
        }
    }
}
