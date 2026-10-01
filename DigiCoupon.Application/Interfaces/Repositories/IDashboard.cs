using DigiCoupon.Domain.Entities;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Repositories
{
    public interface IDashboard
    {
        public Task<T> GetDashboardAsync<T>(int restaurantId, DateTime date) where T : class;
    }
}
