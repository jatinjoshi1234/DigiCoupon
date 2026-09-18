
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
    public abstract class CustomersConfiguration : BaseEntityConfiguration<Customers>
    {
        public override void Configure(EntityTypeBuilder<Customers> entity)
        {
            base.Configure(entity);
            entity.Property(x => x.FirstName)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(x => x.LastName)
                .HasMaxLength(200).IsRequired();

            entity.Property(x => x.NickName)
                .HasMaxLength(200);

            entity.Property(x => x.Mobile)
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(x => x.MemberCode)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.PublicToken)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(x => x.IsActive)
                .HasDefaultValue(true);

            //entity.HasOne(x => x.RestaurantBranch)
            //    .WithMany(x => x.Customers)
            //    .HasForeignKey(x => x.RestaurantBranchId)
            //    .OnDelete(DeleteBehavior.NoAction);

            //entity.HasIndex(x => new
            //{
            //    x.RestaurantBranchId,
            //    x.MemberCode
            //})
            //.IsUnique();

            //entity.HasIndex(x => x.PublicToken)
            //    .IsUnique();

            //entity.HasIndex(x => new
            //{
            //    x.RestaurantBranchId,
            //    x.Mobile
            //});
        }
    }
}
