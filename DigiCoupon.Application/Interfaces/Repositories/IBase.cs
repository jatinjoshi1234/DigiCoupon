using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Repositories
{
    public interface IBase
    {
        /// <summary>
        /// Check record exists or not with active filter 
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns></returns>
        public Task<bool> ExistsActiveAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class;

        /// <summary>
        /// Check record exists or not without active filter 
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns></returns>
        public Task<bool> ExistsAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class;
        
        /// <summary>
        /// Get records count
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns></returns>
        public Task<int> CountAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class;
        /// <summary>
        /// Get active records 
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns></returns>
        public Task<List<TEntity>> GetAllActiveAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class;

        /// <summary>
        /// Get all records include delete
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns></returns>
        public Task<List<TEntity>> GetAllAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class;

        /// <summary>
        /// Get all records records
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns></returns>
        public Task<List<TEntity>> GetAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class;

        public Task<List<TEntity>> GetAsync<TEntity>() where TEntity : class;


        /// <summary>
        /// Get all records records with delete filter
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// /// <param name="includes"></param>
        /// <returns></returns>
        public Task<List<TEntity>> GetAsync<TEntity>(Expression<Func<TEntity, bool>> args, params Expression<Func<TEntity, object>>[] includes) where TEntity : class;

        /// <summary>
        /// Get all records records with delete filter
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="predicate"></param>
        /// <param name="orderBy"></param>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <param name="includes"></param>
        /// <returns></returns>
        public Task<List<TEntity>> GetAsync<TEntity>
        (
            Expression<Func<TEntity, bool>> predicate,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            int? skip = null,
            int? take = null,
            params Func<IQueryable<TEntity>, IQueryable<TEntity>>[] includes
        ) where TEntity : class;

        /// <summary>
        /// Get all records records with delete filter
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="predicate"></param>
        /// <param name="orderBy"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="includes"></param>
        /// <returns>Items and Count</returns>
        public Task<(List<TEntity> Items, int TotalCount)> GetAsync<TEntity>(
                    Expression<Func<TEntity, bool>> predicate,
                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,  
                    int pageNumber = 1,
                    int pageSize = 10,
                    params Func<IQueryable<TEntity>, IQueryable<TEntity>>[] includes)
                    where TEntity : class;



        /// <summary>
        /// get single record with base filter
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns>Entity</returns>
        public Task<TEntity?> GetByIdAsync<TEntity>(Expression<Func<TEntity, bool>> args, bool isTracking = true) where TEntity : class;
        
        /// <summary>
        /// get single record with base filter
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <param name="includes"></param>
        /// <returns></returns>
        public Task<TEntity> GetByIdAsync<TEntity>(Expression<Func<TEntity, bool>> args, params Func<IQueryable<TEntity>, IQueryable<TEntity>>[] includes) where TEntity : class;
        public Task AddAsync<TEntity>(TEntity entity) where TEntity : class;
        public Task AddRangeAsync<TEntity>(List<TEntity> entities) where TEntity : class;
        public void Update<TEntity>(TEntity entity) where TEntity : class;
        public void Delete<TEntity>(TEntity entity) where TEntity : class;
        public Task<int> SaveChangesAsync();
        public Expression<Func<T, bool>> BaseFilter<T>();
        public Expression<Func<T, bool>> ActiveFilter<T>();
        public Task<bool> DeleteExecuteAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class;
        public Task<bool> UpdateExecuteAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, Action<UpdateSettersBuilder<TEntity>> setPropertyCalls) where TEntity : class;
    }
}
