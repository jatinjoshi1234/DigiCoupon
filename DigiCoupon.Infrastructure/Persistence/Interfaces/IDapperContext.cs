using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace DigiCoupon.Infrastructure.Persistence.Interfaces
{
    public interface IDapperContext
    {
        public Task<IEnumerable<T>?> QueryAsync<T>(string query, object? param = null);
        public Task<T?> SingleAsync<T>(string query, object? param = null, CommandType type = CommandType.StoredProcedure);
        public Task<T?> ExecuteScallerAsync<T>(string query, object? param = null, CommandType type = CommandType.StoredProcedure);
        public Task<IEnumerable<T>?> ExecuteAsync<T>(string query, object? param = null);
    }
}
