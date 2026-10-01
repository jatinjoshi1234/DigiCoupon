using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Interfaces.Auth;
using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Application.Interfaces.Services;
using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;

namespace DigiCoupon.Application.Services
{
    public class UserService(IUsers context, IPasswordProvider hashProvider, ITokenProvider tokenProvider, IRestaurantService restuarantContext) : IUserService
    {
        public async Task<ApiResponse> RegisterAsync(RegisterRequestDto request)
        {
            bool isExists = await context.AnyAsync(x => x.Email == request.Email);

            if (isExists)
                return ApiResponse.OnFailer("Email allready registered.");

            isExists = await context.AnyAsync(x => x.Mobile == request.Mobile);

            if (isExists)
                return ApiResponse.OnFailer("Mobile allready registered.");

            string hasPassword = await hashProvider.Hash(new Users()
            {
                Email = request.Email,
                Mobile = request.Mobile,
            }, request.Password);

            var result = await context.AddAsync(MapDto(request, hasPassword));
            return result > 0 ? ApiResponse.OnSuccess("User register successfully.") : ApiResponse.OnSuccess("Enter details are invalid. Please enter correct details");
        }

        public async Task<ApiResponse> LoginAsync(LoginRequestDto request)
        {
            Users user = await context.GetByAsync(x => x.Email == request.UserName || x.Mobile == request.UserName, x => x.Restaurants);

            if (user == null)
                return ApiResponse.OnFailer("User not found. Please register.");

            bool isPassword = await hashProvider.Verify(user, request.Password, user.PasswordHash);

            if (!isPassword)
                return ApiResponse.OnFailer("Incorrect Password.");

            var token = await tokenProvider.GenerateToken(user);

            bool result = await restuarantContext.Exists(user.Id);

            var data = new { AccessToken = token, User = MapDto(user), IsRestuarantCreated = result, Restuarant = result ? await restuarantContext.GetByUserAsync(user.Id) : null };
            return ApiResponse.OnSuccess("User login successfully.", data);
        }

        private Users MapDto(RegisterRequestDto request, string HashPassword)
        {
            var user = new Users()
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = HashPassword,
                Mobile = request.Mobile,
                IsActive = true,
            };
            return user;
        }

        private RegisterRequestDto MapDto(Users obj)
        {
            var user = new RegisterRequestDto(obj.Name, obj.Email, obj.PasswordHash, obj.Mobile)
            {
                Name = obj.Name,
                Email = obj.Email,
                Mobile = obj.Mobile,
            };
            return user;
        }
    }
}
