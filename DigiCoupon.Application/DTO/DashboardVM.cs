using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public class DashboardVM
    {
        public string OwnerName { get; set; }
        public int RestaurantId { get; set; }
        public string RestaurantName { get; set; }
        public int TotalCustomers { get; set; }
        public int ActivePasses { get; set; }
        public int TodayRedemptions { get; set; }
        public int ExpiringPasses { get; set; }
        public string RecentRedemptionsJson { get; set; }
    }

    
}
