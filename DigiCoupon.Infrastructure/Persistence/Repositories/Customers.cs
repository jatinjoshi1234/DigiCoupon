using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Domain.Entities;
using DigiCoupon.Infrastructure.Extensions;
using DigiCoupon.Infrastructure.Persistence.Contexts;
using DigiCoupon.Infrastructure.Persistence.Interfaces;
using DigiCoupon.Infrastructure.Persistence.StoreProcedures;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

using static Dapper.SqlMapper;

namespace DigiCoupon.Infrastructure.Persistence.Repositories
{
    internal class Customers(IBase context, IDapperContext fetch) : ICustomers
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

        public async Task<(int,List<T>)> GetPagedData<T,T1>(T1 args) where T : class where T1 : class
        {
            return await fetch.QueryMultipleAsync<int,T>(CustomerProcedure.ProcName, args.ToDynamicParameters<T1>());
        }

        public async Task<List<T>> GetReportCount<T>(int restId) where T : class
        {
            return await fetch.QueryAsync<T>($"exec {CustomerProcedure.CountsProc} {restId}");
        }

        public async Task<List<Domain.Entities.Customers>> GetAllAsync(int resuarantId, int branchId = 0)
        {
            Expression<Func<Domain.Entities.Customers, bool>> predict = branchId > 0 ? x => x.RestaurantId == resuarantId && x.RestaurantBranchId == branchId : x => x.RestaurantId == resuarantId;
            return await context.GetAsync<Domain.Entities.Customers>(predict);
        }

        public async Task<List<Domain.Entities.Customers>> GetCustomerByRestaurant(int id)
        {
            Expression<Func<Domain.Entities.Customers, Domain.Entities.Customers>> selector =  s => new Domain.Entities.Customers { Id = s.Id, FirstName = s.FirstName, LastName = s.LastName,NickName = s.NickName };
            return await context.GetAllAsync<Domain.Entities.Customers, Domain.Entities.Customers>(x => x.RestaurantId == id, selector);
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
