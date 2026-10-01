using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public record CustomerCouponRequestDto(int Id, int RestaurantBranchId, int CustomerId, string CouponNumber, CouponType CouponType, decimal Price, DateTime StartDate, DateTime EndDate, int TotalCoupon,int UsageCoupon,int RemainingCoupon);

    public record CouponRedemptionRequestDto(int Id,int RestaurantBranchId, int CustomerCouponId, DateTime RedemptionDate);
    
    public record CouponUsageVM(int CouponId,int TotalCoupon,int UsageCoupon,int RemainingCoupon);

}
