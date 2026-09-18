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
    public class RestuarantBranchService(IRestuarantBranches context) : IRestaurantBranchService
    {
        public async Task<ApiResponse> AddAsync(RestuarantBranchDto request)
        {
            bool isExists = await context.AnyAsync(x => x.BranchName == request.BranchName);

            if (isExists)
                return ApiResponse.OnFailer("Branch allready registered.");
            
            var result = await context.AddAsync(MapDto(request));
            return result > 0 ? ApiResponse.OnSuccess("Redord added successfully.") : ApiResponse.OnSuccess("Enter details are invalid. Please enter correct details");
        }

        public async Task<ApiResponse> UpdateAsync(int id, RestuarantBranchDto request)
        {
            bool isExists = await context.AnyAsync(x => x.Id != request.Id && x.BranchName == request.BranchName);

            if (isExists)
                return ApiResponse.OnFailer($"Branch allready registered. Please try with another branch.");
            
            isExists = await context.AnyAsync(x => x.Id == id);

            if (!isExists)
                return ApiResponse.OnFailer($"Record not found.");

            var result = await context.UpdateAsync(MapDto(request));
            return result > 0 ? ApiResponse.OnSuccess("Record updated successfully.") : ApiResponse.OnSuccess("Enter details are invalid. Please enter correct details");
        }

        public async Task<ApiResponse> DeleteAsync(int id)
        {
            var restuarant = await context.GetByAsync(x => x.Id == id);

            if (restuarant == null || restuarant.Id <=0)
                return ApiResponse.OnFailer($"Record not found.");

            var result = await context.DeleteAsync(restuarant);
            return result ? ApiResponse.OnSuccess("Record deleted successfully.") : ApiResponse.OnSuccess("System could not deleted record. Please try again or contact support.");
        }

        public async Task<ApiResponse> GetByIdAsync(int id)
        {
            var restuarant = await context.GetByAsync(x => x.Id == id);

            if (restuarant == null || restuarant.Id <= 0)
                return ApiResponse.OnFailer($"Record not found.");

            return ApiResponse.OnSuccess("Record loaded successfully.",MapDto(restuarant));
        }

        public async Task<ApiResponse> GetAllAsync(int restuarantId)
        {
            List<Domain.Entities.RestaurantBranch> restuarant = await context.GetAllAsync(restuarantId);

            if (restuarant == null && restuarant.Count <= 0)
                return ApiResponse.OnFailer($"Record not found.");

            return ApiResponse.OnSuccess("Record loaded successfully.", restuarant.Select(x => MapDto(x)).ToList());
        }

        private RestaurantBranch MapDto(RestuarantBranchDto request)
        {
            var branch = new RestaurantBranch()
            {
                Id   = request.Id,
                RestaurantId = request.RestaurantId,
                BranchName = request.BranchName,
                Address = request.Address,
                City = request.City, 
                State = request.State,
                Pincode = request.Pincode,
                Mobile = request.Mobile,
                Email = request.Email,
                IsActive = true
            };
            return branch;
        }

        private RestuarantBranchDto MapDto(RestaurantBranch obj)
        {
            return new RestuarantBranchDto(obj.Id,obj.RestaurantId,obj.BranchName,obj.Address,obj.City,obj.State ,obj.Pincode,obj.Mobile,obj.Email);
        }
    }
}
