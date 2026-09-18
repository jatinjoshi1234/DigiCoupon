using DigiCoupon.Application.Interfaces.Repositories;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Infrastructure.Persistence.Repositories
{
    public class RestuarantBranches(IBase context) : IRestuarantBranches
    {
        public async Task<int> AddAsync(Domain.Entities.RestaurantBranch req)
        {
            await context.AddAsync<Domain.Entities.RestaurantBranch>(req);
            await context.SaveChangesAsync();
            return req.Id;
        }

        public async Task<bool> AnyAsync(Expression<Func<Domain.Entities.RestaurantBranch, bool>> args)
        {
            return await context.ExistsAsync<Domain.Entities.RestaurantBranch>(args);
        }

        public async Task<Domain.Entities.RestaurantBranch> GetByAsync(Expression<Func<Domain.Entities.RestaurantBranch, bool>> args)
        {
            return await context.GetByIdAsync<Domain.Entities.RestaurantBranch>(args);
        }

        public async Task<List<Domain.Entities.RestaurantBranch>> GetAllAsync(int args)
        {
            return await context.GetAllAsync<Domain.Entities.RestaurantBranch>(x=>x.RestaurantId == args);
        }

        public async Task<List<Domain.Entities.RestaurantBranch>> GetAsync(int restuarantId)
        {
            return await context.GetAllActiveAsync<Domain.Entities.RestaurantBranch>(x => x.RestaurantId == restuarantId);
        }

        public async Task<int> UpdateAsync(Domain.Entities.RestaurantBranch req)
        {
            context.Update<Domain.Entities.RestaurantBranch>(req);
            await context.SaveChangesAsync();
            return req.Id;
        }

        public async Task<bool> DeleteAsync(Domain.Entities.RestaurantBranch req)
        {
            context.Delete<Domain.Entities.RestaurantBranch>(req);
            return (await context.SaveChangesAsync() > 0);
        }
    }
}
