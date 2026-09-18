
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
    public abstract class PaymentConfiguration : BaseEntityConfiguration<Payment>
    {
        public override void Configure(EntityTypeBuilder<Payment> entity)
        {
            base.Configure(entity);
            entity.Property(x => x.Amount)
                .HasPrecision(18, 2)
                .IsRequired();

            entity.Property(x => x.PaymentDate)
                .IsRequired();

            entity.Property(x => x.PaymentMode)
                .HasConversion<int>()
                .IsRequired();

            entity.Property(x => x.TransactionReference)
                .HasMaxLength(200);

            entity.Property(x => x.ReceiptNumber)
                .HasMaxLength(100);

            entity.Property(x => x.Notes)
                .HasMaxLength(500);

            //entity.HasOne(x => x.RestaurantBranch)
            //    .WithMany(x => x.Payments)
            //    .HasForeignKey(x => x.RestaurantBranchId)
            //    .OnDelete(DeleteBehavior.NoAction);

            //entity.HasOne(x => x.CustomerCoupon)
            //    .WithMany(x => x.Payments)
            //    .HasForeignKey(x => x.CustomerCouponId)
            //    .OnDelete(DeleteBehavior.NoAction);

            //entity.HasOne(x => x.User)
            //    .WithMany(p=>p.Payment)
            //    .HasForeignKey(x => x.CreatedBy)
            //    .OnDelete(DeleteBehavior.NoAction);

            //entity.HasIndex(x => x.CustomerPassId);

            //entity.HasIndex(x => new
            //{
            //    x.RestaurantBranchId,
            //    x.PaymentDate
            //});
        }
    }
}
