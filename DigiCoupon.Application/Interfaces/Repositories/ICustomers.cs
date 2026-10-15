using DigiCoupon.Application.DTO;

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
        public Task<List<Domain.Entities.Customers>> GetCustomerByRestaurant(int id);
        public Task<List<T>> GetReportCount<T>(int restId) where T : class;
        public Task<(int, List<T>)> GetPagedData<T, T1>(T1 args) where T : class where T1 : class;
    }
}
