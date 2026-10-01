using DigiCoupon.Application.Interfaces;
using DigiCoupon.Domain.Entities;

using DigiCoupon.Domain.Common;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Infrastructure.Persistence.Contexts
{
    public class DigiCouponContext : DbContext
    {
        private readonly ICurrentUser _userContext;
        public DigiCouponContext(DbContextOptions<DigiCouponContext> options,ICurrentUser userContext) : base(options)
        {
            _userContext = userContext;
        }
        public DbSet<Users> Users { get; set; }

        public DbSet<Restaurant> Restaurants { get; set; }

        public DbSet<RestaurantBranch> RestaurantBranches { get; set; }

        public DbSet<Customers> Customers { get; set; }

        public DbSet<CustomerCoupon> CustomerCoupon { get; set; }

        public DbSet<CouponRedemption> CouponRedemptions { get; set; }

        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DigiCouponContext).Assembly);
            foreach (var foreignKey in modelBuilder.Model
                  .GetEntityTypes()
                  .SelectMany(x => x.GetForeignKeys()))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.NoAction;
            }
            //ConfigureUser(modelBuilder);
            //ConfigureRestaurant(modelBuilder);
            //ConfigureRestaurantBranch(modelBuilder);
            //ConfigureCustomer(modelBuilder);
            //ConfigureCustomerPass(modelBuilder);
            //ConfigureCouponRedemption(modelBuilder);
            //ConfigurePayment(modelBuilder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<AuditableEntity>();
            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedOn = DateTime.Now;
                    entry.Entity.UserId = _userContext.UserId;
                    entry.Entity.DeletedBy = null;
                    entry.Entity.DeletedOn = null;
                    entry.Entity.IsDeleted = false;
                    entry.Entity.ModifiedBy = null;
                    entry.Entity.ModifiedOn = null;
                }

                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.ModifiedOn = DateTime.Now;
                    entry.Entity.ModifiedBy = _userContext.UserId;
                }
                if (entry.State == EntityState.Deleted)
                {
                    entry.Entity.DeletedOn = DateTime.Now;
                    entry.Entity.DeletedBy = _userContext.UserId;
                    entry.Entity.IsDeleted = true;
                    entry.State = EntityState.Modified;
                }
            }
            return await base.SaveChangesAsync(cancellationToken);
        }

    }
}
