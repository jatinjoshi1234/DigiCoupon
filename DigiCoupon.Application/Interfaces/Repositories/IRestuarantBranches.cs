using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Repositories
{
    public interface IRestuarantBranches
    {
        public Task<int> AddAsync(Domain.Entities.RestaurantBranch req);
        public Task<bool> AnyAsync(Expression<Func<Domain.Entities.RestaurantBranch, bool>> args);
        public Task<Domain.Entities.RestaurantBranch> GetByAsync(Expression<Func<Domain.Entities.RestaurantBranch, bool>> args);
        public Task<List<Domain.Entities.RestaurantBranch>> GetAsync(int restuarantId);
        public Task<int> UpdateAsync(Domain.Entities.RestaurantBranch req);
        public Task<bool> DeleteAsync(Domain.Entities.RestaurantBranch req);
        public Task<List<Domain.Entities.RestaurantBranch>> GetAllAsync(int args);
    }
}
