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
    internal class Customers(IBase context) : ICustomers
    {
        public async Task<int> AddAsync(Domain.Entities.Customers req)
        {
            await context.AddAsync<Domain.Entities.Customers>(req);
            await context.SaveChangesAsync();
            return req.Id;
        }

        public async Task<bool> AnyAsync(Expression<Func<Domain.Entities.Customers, bool>> args)
        {
            return await context.ExistsAsync<Domain.Entities.Customers>(args);
        }

        public async Task<Domain.Entities.Customers> GetByAsync(Expression<Func<Domain.Entities.Customers, bool>> args)
        {
            return await context.GetByIdAsync<Domain.Entities.Customers>(args) ?? null!;
        }

        public async Task<List<Domain.Entities.Customers>> GetAllAsync(int resuarantId, int branchId = 0)
        {
            Expression<Func<Domain.Entities.Customers, bool>> predict = branchId > 0 ? x => x.RestaurantId == resuarantId && x.RestaurantBranchId == branchId : x => x.RestaurantId == resuarantId;
            return await context.GetAsync<Domain.Entities.Customers>(predict);
        }

        public async Task<int> UpdateAsync(Domain.Entities.Customers req)
        {
            //context.Update<Domain.Entities.Customers>(req);
            var customer = await context.GetByIdAsync<Domain.Entities.Customers>(x => x.Id == req.Id,false);
            if (customer == null)
                return 0;

            customer.RestaurantId = req.RestaurantId;
            customer.RestaurantBranchId = req.RestaurantBranchId;
            customer.FirstName = req.FirstName;
            customer.LastName = req.LastName;
            customer.NickName = req.NickName;
            customer.Mobile = req.Mobile;
            customer.MemberCode = req.MemberCode;
            customer.PublicToken = req.PublicToken;
            await context.SaveChangesAsync();
            return req.Id;
        }

        public async Task<bool> DeleteAsync(Domain.Entities.Customers req)
        {
            context.Delete<Domain.Entities.Customers>(req);
            return (await context.SaveChangesAsync() > 0);
        }
    }
}
