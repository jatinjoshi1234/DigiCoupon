using Dapper;

using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

using static Dapper.SqlMapper;

namespace DigiCoupon.Infrastructure.Persistence.Interfaces
{
    public interface IDapperContext
    {
        public Task<IEnumerable<T>?> QueryAsync<T>(string query, object? param = null);
        public Task<T?> SingleAsync<T>(string query, object? param = null, CommandType type = CommandType.StoredProcedure);
        public Task<T?> ExecuteScallerAsync<T>(string query, object? param = null, CommandType type = CommandType.StoredProcedure);
        public Task<IEnumerable<T>?> ExecuteAsync<T>(string query, object? param = null);
        public Task<List<T>> QueryAsync<T>(string query);
        public Task<(T1, List<T2>)> QueryMultipleAsync<T1, T2>(string query, DynamicParameters param);
    }
}
