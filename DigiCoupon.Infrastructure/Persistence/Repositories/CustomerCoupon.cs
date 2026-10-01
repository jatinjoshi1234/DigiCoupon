using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Domain.Entities;
using DigiCoupon.Infrastructure.Persistence.Contexts;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

using static Dapper.SqlMapper;

namespace DigiCoupon.Infrastructure.Persistence.Repositories
{
    internal class CustomerCoupon(IBase context) : ICustomerCoupon
    {
        public async Task<int> AddAsync(Domain.Entities.CustomerCoupon req)
        {
            await context.AddAsync<Domain.Entities.CustomerCoupon>(req);
            await context.SaveChangesAsync();
            if (req.Id > 0)
            {
                await context.UpdateExecuteAsync<Domain.Entities.CustomerCoupon>((x => x.Id == req.Id), (s => { s.SetProperty(si => si.CouponNumber, $"DC-{req.Id:D6}"); }));
            }
            return req.Id;
        }

        public async Task<bool> AnyAsync(Expression<Func<Domain.Entities.CustomerCoupon, bool>> args)
        {
            return await context.ExistsAsync<Domain.Entities.CustomerCoupon>(args);
        }

        public async Task<Domain.Entities.CustomerCoupon> GetByAsync(Expression<Func<Domain.Entities.CustomerCoupon, bool>> args)
        {
            return await context.GetByIdAsync<Domain.Entities.CustomerCoupon>(args) ?? null!;
        }

        public async Task<Domain.Entities.CustomerCoupon> GetByAsync(Expression<Func<Domain.Entities.CustomerCoupon, bool>> args, Expression<Func<Domain.Entities.CustomerCoupon, object>> args2)
        {
            return await context.GetByIdAsync<Domain.Entities.CustomerCoupon>(args,q=>q.Include(args2)) ?? null!;
        }

        public async Task<List<Domain.Entities.CustomerCoupon>> GetAllAsync(int customerId)
        {
            return await context.GetAsync<Domain.Entities.CustomerCoupon>(x => x.CustomerId == customerId);
        }

        public async Task<int> UpdateAsync(Domain.Entities.CustomerCoupon req)
        {
            //context.Update<Domain.Entities.CustomerCoupon>(req);
            var customerCoupon = await context.GetByIdAsync<Domain.Entities.CustomerCoupon>(x => x.Id == req.Id, false);
            if (customerCoupon == null)
                return 0;

            customerCoupon.CouponType = req.CouponType;
            customerCoupon.Price = req.Price;
            customerCoupon.StartDate = req.StartDate;
            customerCoupon.EndDate = req.EndDate;
            //customerCoupon.TotalUsage = req.TotalUsage;
            await context.SaveChangesAsync();
            return req.Id;
        }

        public async Task<bool> DeleteAsync(Domain.Entities.CustomerCoupon req)
        {
            context.Delete<Domain.Entities.CustomerCoupon>(req);
            return (await context.SaveChangesAsync() > 0);
        }
    }
}
