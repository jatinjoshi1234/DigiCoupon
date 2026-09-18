using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

using static Dapper.SqlMapper;

namespace DigiCoupon.Infrastructure.Persistence.Repositories
{
    internal class Restaurant(IBase context): IRestaurant
    {
        public async Task<int> AddAsync(Domain.Entities.Restaurant req)
        {
            await context.AddAsync<Domain.Entities.Restaurant>(req);
            await context.SaveChangesAsync();
            return req.Id;
        }

        public async Task<bool> AnyAsync(Expression<Func<Domain.Entities.Restaurant, bool>> args)
        {
            return await context.ExistsAsync<Domain.Entities.Restaurant>(args); 
        }

        public async Task<Domain.Entities.Restaurant> GetByAsync(Expression<Func<Domain.Entities.Restaurant, bool>> args)
        {
            Expression<Func<Domain.Entities.Restaurant, bool>> filter = context.BaseFilter<Domain.Entities.Restaurant>();
            filter = filter.And(args);
            return await context.GetByIdAsync<Domain.Entities.Restaurant>(filter);
        }

        public async Task<int> UpdateAsync(Domain.Entities.Restaurant req)
        {
            context.Update<Domain.Entities.Restaurant>(req);
            await context.SaveChangesAsync();
            return req.Id;
        }

        public async Task<bool> DeleteAsync(Domain.Entities.Restaurant req)
        {
            context.Delete<Domain.Entities.Restaurant>(req);
            return (await context.SaveChangesAsync()>0);
        }
    }
}
