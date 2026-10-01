using DigiCoupon.Domain.Common;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Domain.Entities
{
    public class CouponRedemption:AuditableEntity
    {
        public int RestaurantBranchId { get; set; }
        public int CustomerCouponId { get; set; }
        // Date on which restaurant wants to record the redemption
        public DateTime RedemptionDate { get; set; }
        public RestaurantBranch RestaurantBranch { get; set; } 
        public CustomerCoupon CustomerCoupon { get; set; } 
        public Users User { get; set; } 
    }
}
