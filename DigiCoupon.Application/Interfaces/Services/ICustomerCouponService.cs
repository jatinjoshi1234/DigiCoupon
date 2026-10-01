using DigiCoupon.Application.DTO;
using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Services
{
    public interface ICustomerCouponService
    {
        public Task<ApiResponse> AddAsync(CustomerCouponRequestDto request);
        public Task<ApiResponse> UpdateAsync(int id, CustomerCouponRequestDto request);
        public Task<ApiResponse> DeleteAsync(int id);
        public Task<ApiResponse> GetByIdAsync(int id);
        public Task<ApiResponse<CustomerCouponRequestDto>> GetByIdGenericAsync(int id);
        public Task<ApiResponse> GetAllAsync(int customerId);
        public Task<bool> IsExpired(int customerCouponId, DateTime RedemptionDate);
        public Task<bool> IsExist(int customerCouponId, DateTime RedemptionDate);
        public Task<bool> IsActive(int customerCouponId);
    }
}
