using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Interfaces.Repositories;

using DigiCoupon.Infrastructure.Persistence.Contexts;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

using static Dapper.SqlMapper;

namespace DigiCoupon.Infrastructure.Persistence.Repositories
{
    internal class Base : IBase
    {
        protected internal readonly DigiCouponContext _context;
        public Base(DigiCouponContext dbContext)
        {
            _context = dbContext;
        }
        /// <summary>
        /// Check record exists or not with active filter 
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns></returns>
        public async Task<bool> ExistsActiveAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class
        {
            var active = args.And(ActiveFilter<TEntity>());
            active = args.And(BaseFilter<TEntity>());
            return await _context.Set<TEntity>().AsNoTracking().AnyAsync(active);
        }

        /// <summary>
        /// Check record exists or not without active filter 
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns></returns>
        public async Task<bool> ExistsAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class
        {
            var active = args.And(BaseFilter<TEntity>());
            return await _context.Set<TEntity>().AsNoTracking().AnyAsync(active);
        }

        /// <summary>
        /// Get records with delete filter
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns></returns>
        public async Task<List<TEntity>> GetAllActiveAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class
        {
            var filter = BaseFilter<TEntity>();
            filter = filter.And(ActiveFilter<TEntity>());
            filter = filter.And(args);
            return await _context.Set<TEntity>().AsNoTracking().Where(filter).ToListAsync();
        }

        /// <summary>
        /// Get all records records include delete
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns></returns>
        public async Task<List<TEntity>> GetAllAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class
        {
            return await _context.Set<TEntity>().AsNoTracking().Where(args).ToListAsync();
        }

        /// <summary>
        /// Get all records records
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns></returns>
        public async Task<List<TEntity>> GetAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class
        {
            var filter = BaseFilter<TEntity>();
            filter = filter.And(args);
            return await _context.Set<TEntity>().AsNoTracking().Where(filter).ToListAsync();
        }

        /// <summary>
        /// Get all records records with delete filter
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// /// <param name="includes"></param>
        /// <returns></returns>
        public async Task<List<TEntity>> GetAsync<TEntity>(Expression<Func<TEntity, bool>> args, params Expression<Func<TEntity, object>>[] includes) where TEntity : class
        {
            IQueryable<TEntity> q = _context.Set<TEntity>().AsNoTracking();
            if (includes.Any())
            {
                foreach (var include in includes)
                {
                    q = q.Include(include);
                }
            }

            var filter = BaseFilter<TEntity>();
            filter = filter.And(args);
            return await q.Where(args).ToListAsync();
        }

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
        public async Task<List<TEntity>> GetAsync<TEntity>(
            Expression<Func<TEntity, bool>> predicate,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            int? skip = null,
            int? take = null,
            params Func<IQueryable<TEntity>, IQueryable<TEntity>>[] includes)
            where TEntity : class
        {
            IQueryable<TEntity> query = _context.Set<TEntity>().AsNoTracking();

            foreach (var include in includes)
            {
                query = include(query);
            }

            var filter = BaseFilter<TEntity>();
            filter = filter.And(predicate);
            query = query.Where(filter);

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            if (skip.HasValue)
            {
                query = query.Skip(skip.Value);
            }

            if (take.HasValue)
            {
                query = query.Take(take.Value);
            }

            return await query.ToListAsync();
        }

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
        public async Task<(List<TEntity> Items, int TotalCount)> GetAsync<TEntity>(
            Expression<Func<TEntity, bool>> predicate,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            int pageNumber = 1,
            int pageSize = 10,
             params Func<IQueryable<TEntity>, IQueryable<TEntity>>[] includes)
            where TEntity : class
        {
            IQueryable<TEntity> query = _context.Set<TEntity>().AsNoTracking();

            foreach (var include in includes)
            {
                query = include(query);
            }

            var filter = BaseFilter<TEntity>();
            filter = filter.And(predicate);
            query = query.Where(filter);

            var totalCount = await query.CountAsync();

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            var items = await query
                .Skip(pageNumber)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }


        /// <summary>
        /// Get all records records 
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <returns>Items and Count</returns>
        public async Task<List<TEntity>> GetAsync<TEntity>() where TEntity : class
        {
            return await _context.Set<TEntity>().AsNoTracking().ToListAsync();
        }

        /// <summary>
        /// get single record with base filter
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <returns>Entity</returns>
        public async Task<TEntity?> GetByIdAsync<TEntity>(Expression<Func<TEntity, bool>> args,bool isTracking = true) where TEntity : class
        {
            var filter = BaseFilter<TEntity>();
            filter = filter.And(args);
            IQueryable<TEntity> query = _context.Set<TEntity>();
            if(isTracking)
                query = query.AsNoTracking();
            return await query.FirstOrDefaultAsync(filter);
        }

        /// <summary>
        /// get single record with base filter
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="args"></param>
        /// <param name="includes"></param>
        /// <returns></returns>
        public async Task<TEntity?> GetByIdAsync<TEntity>(Expression<Func<TEntity, bool>> args, params Func<IQueryable<TEntity>, IQueryable<TEntity>>[] includes) where TEntity : class
        {
            IQueryable<TEntity> q = _context.Set<TEntity>();
            if (includes.Any())
            {
                foreach (var include in includes)
                {
                    q = include(q);
                }
            }
            var filter = BaseFilter<TEntity>();
            filter = filter.And(args);
            return await q.FirstOrDefaultAsync(filter);
        }

        public async Task AddAsync<TEntity>(TEntity entity) where TEntity : class
        {
            await _context.Set<TEntity>().AddAsync(entity);
        }

        public async Task AddRangeAsync<TEntity>(List<TEntity> entities) where TEntity : class
        {
            await _context.Set<TEntity>().AddRangeAsync(entities);
        }

        public void Update<TEntity>(TEntity entity)
            where TEntity : class
        {
            _context.Set<TEntity>().Update(entity);
        }

        public void Delete<TEntity>(TEntity entity)
            where TEntity : class
        {
            _context.Set<TEntity>().Remove(entity);
        }

        public async Task<bool> DeleteExecuteAsync<TEntity>(Expression<Func<TEntity,bool>> args) where TEntity : class
        {
            return (await _context.Set<TEntity>().Where(args).ExecuteDeleteAsync()) > 0;
        }

        public async Task<bool> UpdateExecuteAsync<TEntity>(Expression<Func<TEntity, bool>> predicate, Action<UpdateSettersBuilder<TEntity>> setPropertyCalls)
    where TEntity : class
        {
            var affectedRows = await _context.Set<TEntity>()
                .Where(predicate)
                .ExecuteUpdateAsync(setPropertyCalls);

            return affectedRows > 0;
        }

        public async Task<int> CountAsync<TEntity>(Expression<Func<TEntity, bool>> args) where TEntity : class
        {
            var filter = BaseFilter<TEntity>();
            filter = filter.And(args);
            return await _context.Set<TEntity>().Where(filter).CountAsync();
        }



        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public Expression<Func<T, bool>> BaseFilter<T>()
        {
            return x => !EF.Property<bool>(x, "IsDeleted");
        }

        public Expression<Func<T, bool>> ActiveFilter<T>()
        {
            return x => EF.Property<bool>(x, "IsActive");
        }

        //public Func<PaginationRequest, int> GetSkip = (args) => (args.PageNumber <= 0 ? 0 : (args.PageNumber - 1)) * args.PageSize;

    }
}
