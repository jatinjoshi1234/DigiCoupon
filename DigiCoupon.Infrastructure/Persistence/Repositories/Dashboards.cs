using Dapper;

using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Infrastructure.Persistence.Contexts;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace DigiCoupon.Infrastructure.Persistence.Repositories
{
    internal class Dashboards(DigiCouponContext _context): IDashboard
    {
        public async Task<T> GetDashboardAsync<T>(int restaurantId,DateTime date) where T :class
        {
            var connection = _context.Database.GetDbConnection();

            return await connection.QueryFirstOrDefaultAsync<T>(
                "dbo.sp_get_dashboard_data",
                new
                {
                    RestaurantId = restaurantId,
                    Date = date.Date
                },
                commandType: CommandType.StoredProcedure);
        }
    }
}
