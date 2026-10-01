using DigiCoupon.Domain.Entities;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Repositories
{
    public interface IUsers
    {
        public Task<int> AddAsync(Domain.Entities.Users req);
        public Task<bool> AnyAsync(Expression<Func<Domain.Entities.Users, bool>> args);
        public Task<Users> GetByAsync(Expression<Func<Domain.Entities.Users, bool>> args);
        public Task<int> UpdateAsync(Domain.Entities.Users req);
        public Task<bool> DeleteAsync(Domain.Entities.Users req);
        public Task<Users> GetByAsync(Expression<Func<Domain.Entities.Users, bool>> args, Expression<Func<Users, object>> args2);
    }
}
