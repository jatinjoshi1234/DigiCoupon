using Dapper;

using DigiCoupon.Infrastructure.Persistence.Interfaces;

using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace DigiCoupon.Infrastructure.Persistence.Contexts
{
    public class DapperContext : IDapperContext
    {
        private readonly string cs;
        public DapperContext(IConfiguration configuration) 
        {
            cs = configuration.GetConnectionString("Default") ?? "";
        }

        private IDbConnection CreateConnection() => new SqlConnection(cs);

        public async Task<IEnumerable<T>?> QueryAsync<T>(string query,object? param = null)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<T>(query, param);
        }

        public async Task<T?> SingleAsync<T>(string query, object? param = null, CommandType type = CommandType.StoredProcedure)
        {
            using var connection = CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<T>(query, param, null, null, type) ?? default!;
        }

        public async Task<T?> ExecuteScallerAsync<T>(string query, object? param = null, CommandType type = CommandType.StoredProcedure)
        {
            using var connection = CreateConnection();
            return await connection.ExecuteScalarAsync<T>(query, param, null, null, type) ?? default!;
        }

        
    }
}
