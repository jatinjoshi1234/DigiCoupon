using DigiCoupon.Domain.Common;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Domain.Entities
{
    public class CustomerCoupon : AuditableEntity
    {
        public int RestaurantBranchId { get; set; }

        public int CustomerId { get; set; }

        public string CouponNumber { get; set; } 
        public CouponType CouponType { get; set; }

        public decimal Price { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
        public bool IsExpired { get; set; }
        // Required for Fixed pass.
        // NULL for Unlimited pass.
        public int? TotalUsage { get; set; }
        public bool IsActive { get; set; } 
        // Navigation
        public RestaurantBranch RestaurantBranch { get; set; }
        public Customers Customer { get; set; }
        public ICollection<Payment> Payments { get; set; }
        public ICollection<CouponRedemption> Redemptions { get; set; }
    }
}
