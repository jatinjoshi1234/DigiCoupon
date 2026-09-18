using DigiCoupon.Domain.Common;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Domain.Entities
{
    public class Customers:AuditableEntity
    {
        public int RestaurantId { get; set; }
        public int? RestaurantBranchId { get; set; }

        public string FirstName { get; set; } = null!;

        public string? LastName { get; set; }

        public string? NickName { get; set; }

        public string Mobile { get; set; } = null!;

        public string MemberCode { get; set; } = null!;

        // Used for public customer pass URL
        public string PublicToken { get; set; } = null!;

        public bool IsActive { get; set; } = true;

        // Navigation
        public RestaurantBranch RestaurantBranch { get; set; }
        public Restaurant Restaurant { get; set; }

        public ICollection<CustomerCoupon> Coupon { get; set; }
    }
}
