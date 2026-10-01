using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Interfaces.Auth;
using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Application.Interfaces.Services;
using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Xml.Linq;

namespace DigiCoupon.Application.Services
{
    public class CouponRedemptionsService(ICouponRedemption context, ICustomerCouponService couponService) : ICouponRedemptionsService
    {
        public async Task<ApiResponse> AddAsync(CouponRedemptionRequestDto request)
        {
            if (await context.AnyAsync(x => x.CustomerCouponId == request.CustomerCouponId && DateTime.Now.Date < request.RedemptionDate.Date))
                return ApiResponse.OnFailer($"You can not redemption future date pass.");

            int count = await context.CountAsync(x => x.CustomerCouponId == request.CustomerCouponId && (x.RedemptionDate.Date == request.RedemptionDate.Date));

            //if (count >= 2)
            //    return ApiResponse.OnFailer($"Pass allready redemptioned.");

            if (await couponService.IsExpired(request.CustomerCouponId, request.RedemptionDate))
                return ApiResponse.OnFailer($"Pass validity is expired.");

            if (!await couponService.IsExist(request.CustomerCouponId, request.RedemptionDate))
                return ApiResponse.OnFailer($"Pass diary not found of redemption date ${request.RedemptionDate.ToString("dd MMM yyyy")}.");

            if (!await couponService.IsActive(request.CustomerCouponId))
                return ApiResponse.OnFailer($"Pass diary is not active.");

            var coupon = await couponService.GetByIdGenericAsync(request.CustomerCouponId);

            if (coupon.Status && coupon.Data != null && coupon.Data.RemainingCoupon <= 0)
            {
                return ApiResponse.OnFailer("Coupon diary is over you can not redeem coupon, buy new diary.");
            }

            var result = await context.AddAsync(MapDto(request));
            return result > 0 ? ApiResponse.OnSuccess("Redord added successfully.") : ApiResponse.OnFailer("Enter details are invalid. Please enter correct details");
        }

        public async Task<ApiResponse> AddRangeAsync(int customerCouponId, DateTime fromDate, DateTime toDate)
        {
            int totalDays = Convert.ToInt32((fromDate - toDate).TotalDays);
            List<CouponRedemption> redeems = Enumerable.Range(0, totalDays).Select(x => new CouponRedemption { CustomerCouponId = customerCouponId, RedemptionDate = fromDate.AddDays(x) }).ToList();
            await context.AddRangeAsync(redeems);
            return ApiResponse.OnSuccess("Coupon diary created successfully.");
        }

        public async Task<ApiResponse> DeleteByCouponAsync(int couponId)
        {
            var coupn = await couponService.GetByIdAsync(couponId);
            bool result = await context.DeleteByCouponAsync(couponId);
            return result ? ApiResponse.OnSuccess("Deleted all coupon of this diaries.") : ApiResponse.OnFailer("System could not deleted coupons of this diaries.");
        }

        public async Task<ApiResponse> UpdateAsync(int id, CouponRedemptionRequestDto request)
        {
            bool isExists = false;

            isExists = await context.AnyAsync(x => x.Id == id && x.RedemptionDate.Date == request.RedemptionDate);

            if (!isExists)
                return ApiResponse.OnFailer($"Record not found.");

            var result = await context.UpdateAsync(MapDto(request)); // only update price and coupon type
            return result > 0 ? ApiResponse.OnSuccess("Record updated successfully.") : ApiResponse.OnSuccess("Enter details are invalid. Please enter correct details");
        }

        public async Task<ApiResponse> DeleteAsync(int id)
        {
            var customer = await context.GetByAsync(x => x.Id == id);

            if (customer == null || customer.Id <= 0)
                return ApiResponse.OnFailer($"Record not found.");

            var result = await context.DeleteAsync(customer);
            return result ? ApiResponse.OnSuccess("Record deleted successfully.") : ApiResponse.OnSuccess("System could not deleted record. Please try again or contact support.");
        }

        public async Task<ApiResponse> GetByIdAsync(int id)
        {
            var customer = await context.GetByAsync(x => x.Id == id);

            if (customer == null || customer.Id <= 0)
                return ApiResponse.OnFailer($"Record not found.");

            return ApiResponse.OnSuccess("Record loaded successfully.", MapDto(customer));
        }

        public async Task<ApiResponse> GetAllAsync(int customerCouponId, DateTime? fromDate, DateTime? toDate)
        {

            List<Domain.Entities.CouponRedemption> customer = await context.GetAllAsync(customerCouponId, fromDate, toDate);

            if (customer == null && customer.Count <= 0)
                return ApiResponse.OnFailer($"Record not found.");

            return ApiResponse.OnSuccess("Record loaded successfully.", customer.Select(x => MapDto(x)).ToList());
        }

        private CouponRedemption MapDto(CouponRedemptionRequestDto request)
        {
            var Customer = new CouponRedemption()
            {
                RestaurantBranchId = request.RestaurantBranchId,
                CustomerCouponId = request.CustomerCouponId,
                RedemptionDate = request.RedemptionDate
            };
            return Customer;
        }

        private CouponRedemptionRequestDto MapDto(CouponRedemption obj)
        {
            return new CouponRedemptionRequestDto(obj.Id, obj.RestaurantBranchId, obj.CustomerCouponId, obj.RedemptionDate);
        }
    }
}
