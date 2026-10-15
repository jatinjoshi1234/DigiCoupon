using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public class DashboardVM
    {
        public string OwnerName { get; set; } = "";
        public int RestaurantId { get; set; }
        public string RestaurantName { get; set; } = "";
        public int TotalCustomers { get; set; }
        public int ActivePasses { get; set; }
        public int TotalRedemptions { get; set; }
        public int TodayRedemptions { get; set; }
        public int ExpiringPasses { get; set; }
        public int RecentRedemptions { get; set; }
        public IEnumerable<RecentRedemptions> RecentRedemption { get; set; }
    }

    public class RecentRedemptions {
        public string CouponNumber { get; set; } = string.Empty;
        public string Customer    {get;set;} = string.Empty;
        public string FromDate {get;set;} = string.Empty;
        public string ToDate  {get;set;} = string.Empty;
        public string RedemptionOn{get;set;} = string.Empty;
    }
    
}
