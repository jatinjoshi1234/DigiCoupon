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
    public abstract class RestaurantConfiguration : BaseEntityConfiguration<Restaurant>
    {
        public override void Configure(EntityTypeBuilder<Restaurant> entity)
        {
            base.Configure(entity);
            entity.Property(x => x.Name).HasMaxLength(500).IsRequired();

            entity.Property(x => x.Email).HasMaxLength(300);

            entity.Property(x => x.Address).HasMaxLength(500);

            entity.Property(x => x.Mobile).HasMaxLength(20);
            entity.Property(x => x.FssaiLicenseNo).HasMaxLength(50);

            entity.Property(x => x.IsActive).HasDefaultValue(true);

            //entity.HasOne(x => x.CreatedByUser).WithMany(x=>x.Restaurants).HasForeignKey(x => x.CreatedBy).IsRequired(false).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
