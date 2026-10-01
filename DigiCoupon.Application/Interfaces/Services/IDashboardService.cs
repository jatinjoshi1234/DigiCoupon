using DigiCoupon.Application.DTO;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Services
{
    public interface IDashboardService
    {
        public Task<DashboardVM> GetDashboardAsync(int restaurantId, DateTime date);
    }
}
