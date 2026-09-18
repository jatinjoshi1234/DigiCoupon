using DigiCoupon.Application.DTO;
using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Services
{
    public interface IRestaurantService
    {
        public Task<ApiResponse> AddAsync(RestuarantRequestDto request);
        public Task<ApiResponse> UpdateAsync(int id, RestuarantRequestDto request);
        public Task<ApiResponse> DeleteAsync(int id);
        public Task<ApiResponse> GetByIdAsync(int id);

    }
}
