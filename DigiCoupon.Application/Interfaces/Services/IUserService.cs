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

    }
}
