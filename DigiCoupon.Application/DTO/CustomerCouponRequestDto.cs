using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public record CustomerCouponRequestDto(int Id, int CustomerId, CouponType CouponType, decimal Price, DateTime StartDate, DateTime EndDate);

    public record CouponRedemptionRequestDto(int Id, int CustomerCouponId,int Quantity ,DateTime RedemptionDate);

}
