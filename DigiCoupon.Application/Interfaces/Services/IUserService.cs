using DigiCoupon.Application.DTO;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Services
{
    public interface IUserService
    {
        public Task<ApiResponse> RegisterAsync(RegisterRequestDto request);
        public Task<ApiResponse> LoginAsync(LoginRequestDto request);
        public Task<ApiResponse> GetCurrentUserAsync(int userId);
        public Task<ApiResponse> UpdateUserAsync(int userId, RegisterRequestDto request);
        public Task<ApiResponse> ForgotPasswordAsync(ForgotPasswordRequestDto request);
        public Task<ApiResponse> ChangePasswordAsync(int userId, ChangePasswordRequestDto request);
    }
}
