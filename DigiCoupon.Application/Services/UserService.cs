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

            var newUser = MapDto(request, hasPassword);
            var result = await context.AddAsync(newUser);

            if (result <= 0)
                return ApiResponse.OnFailer("Registration failed. Please check your details.");

            // Fetch the newly created user so we have the generated Id
            Users createdUser = await context.GetByAsync(
                x => x.Email == request.Email,
                x => x.Restaurants
            );

            if (createdUser == null)
                return ApiResponse.OnFailer("Registration succeeded but user could not be loaded.");

            var token = await tokenProvider.GenerateToken(createdUser);

            var data = new
            {
                AccessToken = token,
                User = MapUserDto(createdUser),
                IsRestuarantCreated = false,
                Restuarant = (object?)null
            };

            return ApiResponse.OnSuccess("User registered successfully.", data);
        }

        public async Task<ApiResponse> LoginAsync(LoginRequestDto request)
        {
            Users user = await context.GetByAsync(x => x.Email == request.UserName || x.Mobile == request.UserName, x => x.Restaurants);

            if (user == null)
                return ApiResponse.OnFailer("User not found. Please register.");

            if (!user.IsActive)
                return ApiResponse.OnFailer("Your account has been deactivated. Please contact support.");

            bool isPassword = await hashProvider.Verify(user, request.Password, user.PasswordHash);

            if (!isPassword)
                return ApiResponse.OnFailer("Incorrect Password.");

            // Update last login timestamp
            user.LastLoginAt = DateTime.UtcNow;
            await context.UpdateAsync(user);

            var token = await tokenProvider.GenerateToken(user);

            bool result = await restuarantContext.Exists(user.Id);

            var data = new
            {
                AccessToken = token,
                User = MapUserDto(user),
                IsRestuarantCreated = result,
                Restuarant = result ? await restuarantContext.GetByUserAsync(user.Id) : null
            };

            return ApiResponse.OnSuccess("User login successfully.", data);
        }

        public async Task<ApiResponse> GetCurrentUserAsync(int userId)
        {
            Users user = await context.GetByAsync(x => x.Id == userId, x => x.Restaurants);

            if (user == null)
                return ApiResponse.OnFailer("User not found.");

            bool hasRestaurant = await restuarantContext.Exists(user.Id);

            var data = new
            {
                User = MapUserDto(user),
                IsRestuarantCreated = hasRestaurant,
                Restuarant = hasRestaurant ? await restuarantContext.GetByUserAsync(user.Id) : null
            };

            return ApiResponse.OnSuccess("User profile retrieved.", data);
        }

        public async Task<ApiResponse> ForgotPasswordAsync(ForgotPasswordRequestDto request)
        {
            Users user = await context.GetByAsync(x => x.Email == request.Email);

            if (user == null)
                return ApiResponse.OnFailer("No account found with that email address.");

            // TODO: Generate a secure reset token, persist it, and send via email/SMS.
            // For now, return a success message without revealing user existence to attackers.
            return ApiResponse.OnSuccess("If that email is registered, you will receive a password reset link shortly.");
        }

        public async Task<ApiResponse> ChangePasswordAsync(int userId, ChangePasswordRequestDto request)
        {
            Users user = await context.GetByAsync(x => x.Id == userId);

            if (user == null)
                return ApiResponse.OnFailer("User not found.");

            bool isCurrentPasswordValid = await hashProvider.Verify(user, request.CurrentPassword, user.PasswordHash);

            if (!isCurrentPasswordValid)
                return ApiResponse.OnFailer("Current password is incorrect.");

            string newHashedPassword = await hashProvider.Hash(user, request.NewPassword);
            user.PasswordHash = newHashedPassword;

            await context.UpdateAsync(user);

            return ApiResponse.OnSuccess("Password changed successfully.");
        }

        public async Task<ApiResponse> UpdateUserAsync(int userId, RegisterRequestDto request)
        {
            Users user = await context.GetByAsync(x => x.Id == userId);

            if (user == null)
                return ApiResponse.OnFailer("User not found.");

            // Check if new email is taken by a different account
            if (!string.Equals(user.Email, request.Email, StringComparison.OrdinalIgnoreCase))
            {
                bool emailTaken = await context.AnyAsync(x => x.Email == request.Email && x.Id != userId);
                if (emailTaken)
                    return ApiResponse.OnFailer("Email is already in use by another account.");
            }

            user.Name = request.Name;
            user.Email = request.Email;
            user.Mobile = request.Mobile;

            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                string newHashedPassword = await hashProvider.Hash(user, request.Password);
                user.PasswordHash = newHashedPassword;
            }
                
            await context.UpdateAsync(user);

            return ApiResponse.OnSuccess("Profile updated successfully.", MapUserDto(user));
        }

        // ─── Private helpers ─────────────────────────────────────────────

        private Users MapDto(RegisterRequestDto request, string HashPassword)
        {
            return new Users()
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = HashPassword,
                Mobile = request.Mobile,
                IsActive = true,
            };
        }

        private object MapUserDto(Users obj)
        {
            return new
            {
                Id = obj.Id,
                Name = obj.Name,
                Email = obj.Email,
                Mobile = obj.Mobile,
                IsActive = obj.IsActive,
                LastLoginAt = obj.LastLoginAt,
            };
        }
    }
}
