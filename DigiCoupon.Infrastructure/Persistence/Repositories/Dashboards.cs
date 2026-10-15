using Dapper;

using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Infrastructure.Persistence.Contexts;
using DigiCoupon.Infrastructure.Persistence.StoreProcedures;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Text;

namespace DigiCoupon.Infrastructure.Persistence.Repositories
{
    internal class Dashboards(DigiCouponContext _context): IDashboard
    {
        public async Task<T> GetDashboardAsync<T>(int restaurantId) where T :class
        {
            var connection = _context.Database.GetDbConnection();
            var result = await connection.QueryFirstOrDefaultAsync<T>($"exec {DashboardProcedure.DashboardProc} {restaurantId}",null,null,null, CommandType.Text);
            return result ?? default!;
        }
        public async Task<IEnumerable<T>> RecentRedemption<T>(int restaurantId) where T : class
        {
            var connection = _context.Database.GetDbConnection();

            return await connection.QueryAsync<T>($"exec {DashboardProcedure.RecentRecepmtionPcoc} {restaurantId}",commandType: CommandType.Text);
        }
    }
}
