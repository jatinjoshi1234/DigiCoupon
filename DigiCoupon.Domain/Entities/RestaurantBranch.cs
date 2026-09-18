using DigiCoupon.Domain.Common;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Domain.Entities
{
    public class RestaurantBranch : AuditableEntity
    {
        public int RestaurantId { get; set; }

        public string BranchName { get; set; } 

        public string Address { get; set; } 

        public string? City { get; set; }

        public string? State { get; set; }

        public string? Pincode { get; set; }

        public string? Mobile { get; set; }

        public string? Email { get; set; }

        public bool IsActive { get; set; } 
        // Navigation
        public Restaurant Restaurant { get; set; } 

        public ICollection<Customers> Customers { get; set; }

        public ICollection<CustomerCoupon> CustomerCoupon { get; set; }

        public ICollection<Payment> Payments { get; set; }

        public ICollection<CouponRedemption> CouponRedemptions { get; set; }
    }
}
