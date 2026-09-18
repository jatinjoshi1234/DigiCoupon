
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
    public abstract class CouponRedemptionConfiguration : BaseEntityConfiguration<CouponRedemption>
    {
        public override void Configure(EntityTypeBuilder<CouponRedemption> entity)
        {
            base.Configure(entity);

            entity.Property(x => x.RedemptionDate)
                .IsRequired();

            //entity.HasOne(x => x.RestaurantBranch)
            //    .WithMany(x => x.CouponRedemptions)
            //    .HasForeignKey(x => x.RestaurantBranchId)
            //    .OnDelete(DeleteBehavior.NoAction);

            //entity.HasOne(x => x.CustomerCoupon)
            //    .WithMany(x => x.Redemptions)
            //    .HasForeignKey(x => x.CustomerCouponId)
            //    .OnDelete(DeleteBehavior.NoAction);

            //entity.HasOne(x => x.User)
            //    .WithMany(c=>c.CouponRedemption)
            //    .HasForeignKey(x => x.CreatedBy).IsRequired(false)
            //    .OnDelete(DeleteBehavior.NoAction);

            //entity.HasIndex(x => new
            //{
            //    x.RestaurantBranchId,
            //    x.RedemptionDate
            //});

            //entity.HasIndex(x => x.CustomerCouponId);
        }
    }
}
