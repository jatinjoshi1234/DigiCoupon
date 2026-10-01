
using DigiCoupon.Domain.Entities;

using DigiCoupon.Domain.Common;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using System.Text;

using static Dapper.SqlMapper;

namespace DigiCoupon.Infrastrucure.Persistence.Configurations
{
    public abstract class CustomerCouponConfiguration : BaseEntityConfiguration<CustomerCoupon>
    {
        public override void Configure(EntityTypeBuilder<CustomerCoupon> entity)
        {
            base.Configure(entity);
            entity.Property(x => x.CouponNumber)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.CouponType)
                .HasConversion<int>()
                .IsRequired();

            entity.Property(x => x.IsExpired)
                .HasDefaultValueSql("0");

            entity.Property(x => x.Price)
                .HasPrecision(18, 2)
                .IsRequired();

            entity.Property(x => x.StartDate)
                .IsRequired();

            entity.Property(x => x.EndDate)
                .IsRequired();

            entity.Property(x => x.IsActive)
                .HasDefaultValue(true);

            //entity.HasOne(x => x.RestaurantBranch)
            //      .WithMany(x => x.CustomerCoupon)
            //      .HasForeignKey(x => x.RestaurantBranchId).IsRequired(false)
            //      .OnDelete(DeleteBehavior.NoAction);

            //   entity.HasOne(x => x.Customer)
            //       .WithMany(x => x.Coupon)
            //       .HasForeignKey(x => x.CustomerId)
            //       .OnDelete(DeleteBehavior.NoAction);

            entity.HasIndex(x => new
            {
                x.CouponNumber
            }).IsUnique();

            //   entity.HasIndex(x => x.CustomerId);
        }
    }
}
