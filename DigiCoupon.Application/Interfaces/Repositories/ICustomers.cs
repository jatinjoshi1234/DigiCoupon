using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Repositories
{
    public interface ICustomers
    {
        public Task<int> AddAsync(Domain.Entities.Customers req);
        public Task<bool> AnyAsync(Expression<Func<Domain.Entities.Customers, bool>> args);
        public Task<Domain.Entities.Customers> GetByAsync(Expression<Func<Domain.Entities.Customers, bool>> args);
        public Task<List<Domain.Entities.Customers>> GetAllAsync(int resuarantId, int branchId = 0);
        public Task<int> UpdateAsync(Domain.Entities.Customers req);
        public Task<bool> DeleteAsync(Domain.Entities.Customers req);
        public Task<IEnumerable<T>> GetCustomerByRestaurant<T>(int id) where T : class;
    }
}
