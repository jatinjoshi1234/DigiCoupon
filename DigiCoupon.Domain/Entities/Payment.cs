using DigiCoupon.Domain.Common;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Domain.Entities
{
    public class Payment : AuditableEntity
    {
        public int RestaurantBranchId { get; set; }

        public int CustomerCouponId { get; set; }

        public decimal Amount { get; set; }

        public DateTime PaymentDate { get; set; }

        public PaymentMode PaymentMode { get; set; }

        public string? TransactionReference { get; set; }

        public string? ReceiptNumber { get; set; }

        public string? Notes { get; set; }

        // Navigation
        public RestaurantBranch RestaurantBranch { get; set; } 

        public CustomerCoupon CustomerCoupon { get; set; }

        public Users User { get; set; }
    }
}
