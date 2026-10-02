using DigiCoupon.Application.DTO;
using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Services
{
    public interface ICustomerService
    {
        public Task<ApiResponse> AddAsync(CustomerRequestDto request);
        public Task<ApiResponse> UpdateAsync(int id, CustomerRequestDto request);
        public Task<ApiResponse> DeleteAsync(int id);
        public Task<ApiResponse> GetByIdAsync(int id);
        public Task<ApiResponse> GetAllAsync(int restuarantId,int branchId=0);
        public Task<ApiResponse> GetByRestaurantAsync(int restuarantId);
    }
}
