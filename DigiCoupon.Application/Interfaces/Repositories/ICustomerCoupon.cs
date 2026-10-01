using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Repositories
{
    public interface ICustomerCoupon
    {
        public Task<int> AddAsync(CustomerCoupon req);
        public Task<bool> AnyAsync(Expression<Func<CustomerCoupon, bool>> args);
        public Task<CustomerCoupon> GetByAsync(Expression<Func<CustomerCoupon, bool>> args);
        public Task<CustomerCoupon> GetByAsync(Expression<Func<CustomerCoupon, bool>> args, Expression<Func<CustomerCoupon, object>> args2);
        public Task<List<CustomerCoupon>> GetAllAsync(int customerId);
        public Task<int> UpdateAsync(CustomerCoupon req);
        public Task<bool> DeleteAsync(CustomerCoupon req);
    }
}
