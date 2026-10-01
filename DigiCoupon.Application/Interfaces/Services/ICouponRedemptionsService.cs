using DigiCoupon.Application.DTO;
using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Services
{
    public interface ICouponRedemptionsService
    {
        public Task<ApiResponse> AddAsync(CouponRedemptionRequestDto request);
        public Task<ApiResponse> AddRangeAsync(int customerCouponId, DateTime fromDate, DateTime toDate);
        public Task<ApiResponse> UpdateAsync(int id, CouponRedemptionRequestDto request);
        public Task<ApiResponse> DeleteAsync(int id);
        public Task<ApiResponse> GetByIdAsync(int id);
        public Task<ApiResponse> GetAllAsync(int customerCouponId, DateTime? fromDate, DateTime? toDate);
        public Task<ApiResponse> DeleteByCouponAsync(int couponId);
    }
}
