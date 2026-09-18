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
    public abstract class UsersConfiguration : BaseEntityConfiguration<Users>
    {
        public override void Configure(EntityTypeBuilder<Users> entity)
        {
            base.Configure(entity);
            entity.Property(x => x.Name)
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(x => x.Email)
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(x => x.Mobile)
                .HasMaxLength(20).IsRequired();

            entity.Property(x => x.PasswordHash)
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(x => x.IsActive)
                .HasDefaultValue(true);

            entity.HasIndex(x => x.Email)
                .IsUnique();
        }
    }
}
