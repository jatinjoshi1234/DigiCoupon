using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Repositories
{
    public interface ICouponRedemption
    {
        public Task<int> AddAsync(CouponRedemption req);
        public Task<bool> AnyAsync(Expression<Func<CouponRedemption, bool>> args);
        public Task<int> CountAsync(Expression<Func<CouponRedemption, bool>> args);
        public Task<CouponRedemption> GetByAsync(Expression<Func<CouponRedemption, bool>> args);
        public Task<List<CouponRedemption>> GetAllAsync(int customerId);
        public Task<int> UpdateAsync(CouponRedemption req);
        public Task<bool> DeleteAsync(CouponRedemption req);
        public Task<bool> DeleteByCouponAsync(int CustomerCouponId);
        public Task<List<CouponRedemption>> GetAllAsync(int customerCouponId, DateTime? startDate, DateTime? endDate);
        public Task AddRangeAsync(List<CouponRedemption> req);
        
    }
}
