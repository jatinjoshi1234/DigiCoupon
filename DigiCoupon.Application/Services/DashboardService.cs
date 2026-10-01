using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Interfaces.Auth;
using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Application.Interfaces.Services;
using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;

namespace DigiCoupon.Application.Services
{
    public class DashboardService(IDashboard context) :IDashboardService
    {
        public async Task<DashboardVM> GetDashboardAsync(int restaurantId, DateTime date) 
        {
            var result = await context.GetDashboardAsync<DashboardVM>(restaurantId, date);
            return result;
        }
    }
}
