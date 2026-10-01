using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Interfaces;
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
    public class RestuarantService(IRestaurant context, ICurrentUser userContext) : IRestaurantService
    {
        public async Task<ApiResponse> AddAsync(RestuarantRequestDto request)
        {
            bool isExists = false;
            isExists = await context.AnyAsync(x => x.UserId == userContext.UserId);

            if (isExists)
                return ApiResponse.OnFailer("You can add only one restuarant.");

            isExists = await context.AnyAsync(x => x.Mobile == request.Mobile);

            if (isExists)
                return ApiResponse.OnFailer("Mobile allready registered.");


            var result = await context.AddAsync(MapDto(request));
            return result > 0 ? ApiResponse.OnSuccess("Redord added successfully.") : ApiResponse.OnSuccess("Enter details are invalid. Please enter correct details");
        }

        public async Task<bool> Exists(int userId)
        {
            return await context.AnyAsync(x => x.UserId == userId);
        }

        public async Task<ApiResponse> UpdateAsync(int id, RestuarantRequestDto request)
        {
            bool isExists = await context.AnyAsync(x => x.Id != request.Id && x.Mobile == request.Mobile || x.Email == request.Email);

            if (!isExists)
                return ApiResponse.OnFailer($"Email or Mobile no allready registered. Please try with another email or password.");

            isExists = await context.AnyAsync(x => x.Id == id);

            if (!isExists)
                return ApiResponse.OnFailer($"Record not found.");

            var result = await context.UpdateAsync(MapDto(request));
            return result > 0 ? ApiResponse.OnSuccess("Record updated successfully.") : ApiResponse.OnSuccess("Enter details are invalid. Please enter correct details");
        }

        public async Task<ApiResponse> DeleteAsync(int id)
        {
            var restuarant = await context.GetByAsync(x => x.Id == id);

            if (restuarant == null || restuarant.Id <= 0)
                return ApiResponse.OnFailer($"Record not found.");

            var result = await context.DeleteAsync(restuarant);
            return result ? ApiResponse.OnSuccess("Record deleted successfully.") : ApiResponse.OnSuccess("System could not deleted record. Please try again or contact support.");
        }

        public async Task<ApiResponse> GetByIdAsync(int id)
        {
            var restuarant = await context.GetByAsync(x => x.Id == id);

            if (restuarant == null || restuarant.Id <= 0)
                return ApiResponse.OnFailer($"Record not found.");

            return ApiResponse.OnSuccess("Record loaded successfully.", MapDto(restuarant));
        }

        public async Task<RestuarantRequestDto> GetByUserAsync(int id)
        {
            var restuarant = await context.GetByAsync(x => x.UserId == id);

            return MapDto(restuarant);
        }

        private Restaurant MapDto(RestuarantRequestDto request)
        {
            var user = new Restaurant()
            {
                Id = request.Id,
                Name = request.Name,
                Email = request.Email,
                FssaiLicenseNo = request.FssaiLicenseNo,
                Mobile = request.Mobile,
                Address = request.Address
            };
            return user;
        }

        private RestuarantRequestDto MapDto(Restaurant obj)
        {
            return new RestuarantRequestDto(obj.Id, obj.Name, obj.Email, obj.Mobile, obj.FssaiLicenseNo, obj.Address);
        }
    }
}
