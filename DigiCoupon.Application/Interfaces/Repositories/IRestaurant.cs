using DigiCoupon.Domain.Entities;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Repositories
{
    public interface IRestaurant
    {
        public Task<int> AddAsync(Restaurant req);
        public Task<int> UpdateAsync(Restaurant req);
        public Task<bool> DeleteAsync(Restaurant req);
        public Task<bool> AnyAsync(Expression<Func<Restaurant, bool>> args);
        public Task<Restaurant> GetByAsync(Expression<Func<Restaurant, bool>> args);
    }
}
