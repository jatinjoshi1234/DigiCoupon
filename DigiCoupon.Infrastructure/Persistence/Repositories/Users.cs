using DigiCoupon.Application.Interfaces.Repositories;


using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

using static Dapper.SqlMapper;

namespace DigiCoupon.Infrastructure.Persistence.Repositories
{
    internal class Users(IBase context): IUsers
    {
        public async Task<int> AddAsync(Domain.Entities.Users req)
        {
            await context.AddAsync<Domain.Entities.Users>(req);
            await context.SaveChangesAsync();
            return req.Id;
        }

        public async Task<bool> AnyAsync(Expression<Func<Domain.Entities.Users, bool>> args)
        {
            return await context.ExistsAsync<Domain.Entities.Users>(args); 
        }

        public async Task<Domain.Entities.Users> GetByAsync(Expression<Func<Domain.Entities.Users, bool>> args) => await context.GetByIdAsync<Domain.Entities.Users>(args);
        
        public async Task<Domain.Entities.Users> GetByAsync(Expression<Func<Domain.Entities.Users, bool>> args, Expression<Func<Domain.Entities.Users, object>> args2) => await context.GetByIdAsync<Domain.Entities.Users>(args,x=>x.Include(args2));

        public async Task<int> UpdateAsync(Domain.Entities.Users req)
        {
            context.Update<Domain.Entities.Users>(req);
            await context.SaveChangesAsync();
            return req.Id;
        }

        public async Task<bool> DeleteAsync(Domain.Entities.Users req)
        {
            context.Delete<Domain.Entities.Users>(req);
            return (await context.SaveChangesAsync()>0);
        }
    }
}
