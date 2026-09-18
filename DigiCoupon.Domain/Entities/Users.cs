using DigiCoupon.Domain.Common;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Domain.Entities
{
    public class Users : AuditableEntity
    {
        public string Name { get; set; }

        public string Email { get; set; }

        public string? Mobile { get; set; }

        public string PasswordHash { get; set; }

        public bool IsActive { get; set; } = true;

        //public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        // Navigation
        public ICollection<Restaurant> Restaurants { get; set; }
        public ICollection<CouponRedemption> CouponRedemption { get; set; }
        public ICollection<Payment> Payment { get; set; }
    }
}
