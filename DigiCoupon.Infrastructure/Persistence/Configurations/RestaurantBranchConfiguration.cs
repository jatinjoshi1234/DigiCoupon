
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
    public abstract class RestaurantBranchConfiguration : BaseEntityConfiguration<RestaurantBranch>
    {
        public override void Configure(EntityTypeBuilder<RestaurantBranch> entity)
        {
            base.Configure(entity);

            entity.Property(x => x.BranchName)
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(x => x.Address)
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(x => x.City)
                .HasMaxLength(200);

            entity.Property(x => x.State)
                .HasMaxLength(200);

            entity.Property(x => x.Pincode)
                .HasMaxLength(10);

            entity.Property(x => x.Mobile)
                .HasMaxLength(20);

            entity.Property(x => x.Email)
                .HasMaxLength(200);

            entity.Property(x => x.IsActive)
                .HasDefaultValue(true);

            //entity.HasOne(x => x.Restaurant)
            //    .WithMany(x => x.Branches)
            //    .HasForeignKey(x => x.RestaurantId)
            //    .OnDelete(DeleteBehavior.NoAction);


            //entity.HasIndex(x => new
            //{
            //    x.RestaurantId,
            //    x.BranchName
            //})
            //.IsUnique();
        }
    }
}
