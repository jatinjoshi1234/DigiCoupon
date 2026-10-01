using DigiCoupon.Application.Interfaces;
using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Domain.Entities;
using DigiCoupon.Infrastructure.Persistence.Contexts;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

using static Dapper.SqlMapper;

namespace DigiCoupon.Infrastructure.Persistence.Repositories
{
    internal class CouponRedemptions(IBase context, ICurrentUser userContext) : ICouponRedemption
    {
        public async Task<int> AddAsync(CouponRedemption req)
        {
            await context.AddAsync<CouponRedemption>(req);
            await context.SaveChangesAsync();
            return req.Id;
        }

        public async Task AddRangeAsync(List<CouponRedemption> req)
        {
            await context.AddRangeAsync<CouponRedemption>(req);
        }

        public async Task<bool> AnyAsync(Expression<Func<CouponRedemption, bool>> args)
        {
            return await context.ExistsAsync<CouponRedemption>(args);
        }
        public async Task<int> CountAsync(Expression<Func<CouponRedemption, bool>> args)
        {
            return await context.CountAsync<CouponRedemption>(args);
        }

        public async Task<CouponRedemption> GetByAsync(Expression<Func<CouponRedemption, bool>> args)
        {
            return await context.GetByIdAsync<CouponRedemption>(args) ?? null!;
        }

        public async Task<List<CouponRedemption>> GetAllAsync(int couponId)
        {
            return await context.GetAsync<CouponRedemption>(x => x.CustomerCouponId == couponId);
        }

        public async Task<List<CouponRedemption>> GetAllAsync(int customerCouponId,DateTime? startDate,DateTime? endDate)
        {
            Expression<Func<CouponRedemption, bool>> predict = x => x.CustomerCouponId == customerCouponId;

            if (startDate.HasValue)
                predict = predict.And(x => x.RedemptionDate.Date >= startDate.Value.Date);
            
            if (endDate.HasValue)
                predict = predict.And(x => x.RedemptionDate.Date <= endDate.Value.Date);

            return await context.GetAsync<CouponRedemption>(predict);
        }

        public async Task<int> UpdateAsync(CouponRedemption req)
        {
            //context.Update<CouponRedemption>(req);
            var customerCoupon = await context.GetByIdAsync<CouponRedemption>(x => x.Id == req.Id, false);
            if (customerCoupon == null)
                return 0;
            await context.SaveChangesAsync();
            return req.Id;
        }

        public async Task<bool> DeleteAsync(CouponRedemption req)
        {
            context.Delete<CouponRedemption>(req);
            return (await context.SaveChangesAsync() > 0);
        }

        public async Task<bool> DeleteByCouponAsync(int CustomerCouponId)
        {
            return await context.UpdateExecuteAsync<CouponRedemption>(
                    x=>x.CustomerCouponId == CustomerCouponId,
                    s=>s.SetProperty(si=>si.IsDeleted,true)
                        .SetProperty(si=>si.DeletedOn,DateTime.Now)
                        .SetProperty(si=>si.DeletedBy,userContext.UserId)
                   );
        }
    }
}
