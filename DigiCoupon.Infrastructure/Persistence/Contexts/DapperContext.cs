using Dapper;

using DigiCoupon.Application.DTO;
using DigiCoupon.Infrastructure.Persistence.Interfaces;

using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

using static Dapper.SqlMapper;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

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

        public async Task<IEnumerable<T>?> ExecuteAsync<T>(string query, object? param = null)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<T>(query, param,null,null,CommandType.StoredProcedure);
        }

        public async Task<T?> SingleAsync<T>(string query, object? param = null, CommandType type = CommandType.StoredProcedure)
        {
            using var connection = CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<T>(query, param, null, null, type) ?? default!;
        }

        public async Task<(T1,List<T2>)> QueryMultipleAsync<T1,T2>(string query, DynamicParameters param)
        {
            using var connection = CreateConnection();
            var result = await connection.QueryMultipleAsync(query, param, commandType: CommandType.StoredProcedure);
            T1 totalRecord = await result.ReadFirstAsync<T1>();
            List<T2> data = (await result.ReadAsync<T2>()).ToList();
            return (totalRecord, data);
        }

        public async Task<List<T2>> QueryAsync<T2>(string query)
        {
            using var connection = CreateConnection();
            var result = await connection.QueryAsync<T2>(query,commandType: CommandType.Text);
            return result.ToList<T2>();
        }

        public async Task<T?> ExecuteScallerAsync<T>(string query, object? param = null, CommandType type = CommandType.StoredProcedure)
        {
            using var connection = CreateConnection();
            return await connection.ExecuteScalarAsync<T>(query, param, null, null, type) ?? default!;
        }

        
    }
}
