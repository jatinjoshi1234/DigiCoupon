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
    public class CustomerCouponService(ICustomerCoupon context) : ICustomerCouponService
    {

        public async Task<ApiResponse> AddAsync(CustomerCouponRequestDto request)
        {
            var currentDate = DateTime.Now;
            bool isExists = await context.AnyAsync(x => x.CustomerId == request.CustomerId && currentDate >= x.StartDate && currentDate <= x.EndDate && x.IsExpired == false);

            if (isExists)
                return ApiResponse.OnFailer($"customer have allready active coupon.");

            isExists = await context.AnyAsync(x => x.CustomerId == request.CustomerId && x.IsExpired == false && (request.StartDate >= x.StartDate && request.EndDate <= x.EndDate) && request.StartDate <= x.EndDate);

            if (isExists)
                return ApiResponse.OnFailer($"customer have allready active coupon between {request.StartDate} and {request.StartDate}.");

            if (request.StartDate < currentDate)
                return ApiResponse.OnFailer($"Start date must be current or future date.");

            var result = await context.AddAsync(MapDto(request));
            bool isAdded = result > 0;
            return isAdded ? ApiResponse.OnSuccess("Redord added successfully.") : ApiResponse.OnSuccess("Enter details are invalid. Please enter correct details");
        }

        public async Task<bool> IsExpired(int customerCouponId, DateTime RedemptionDate)
        {
            return await context.AnyAsync(x => x.Id == customerCouponId && RedemptionDate.Date >= x.StartDate && RedemptionDate.Date <= x.EndDate.Date && x.IsExpired == true);
        }

        public async Task<bool> IsExist(int customerCouponId, DateTime RedemptionDate)
        {
            return await context.AnyAsync(x => x.Id == customerCouponId && RedemptionDate.Date >= x.StartDate && RedemptionDate.Date <= x.EndDate.Date);
        }

        public async Task<bool> IsActive(int customerCouponId)
        {
            return await context.AnyAsync(x => x.Id == customerCouponId && x.IsActive == true);
        }

        public async Task<ApiResponse> UpdateAsync(int id, CustomerCouponRequestDto request)
        {
            bool isExists = false;

            Expression<Func<CustomerCoupon, bool>> predict = x => x.Id == id;
            isExists = await context.AnyAsync(predict);

            if (!isExists)
                return ApiResponse.OnFailer($"Record not found.");

            var coupon = await context.GetByAsync(predict, x => x.Redemptions);

            if (coupon.Redemptions != null && coupon.Redemptions.Any())
                return ApiResponse.OnFailer("Can not update diary after pass redemptions.");

            var result = await context.UpdateAsync(MapDto(request)); // only update price and coupon type
            return result > 0 ? ApiResponse.OnSuccess("Record updated successfully.") : ApiResponse.OnFailer("Enter details are invalid. Please enter correct details");
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
            var customer = await context.GetByAsync(x => x.Id == id, x => x.Redemptions);

            if (customer == null || customer.Id <= 0)
                return ApiResponse.OnFailer($"Record not found.");

            return ApiResponse.OnSuccess("Record loaded successfully.", MapDto(customer));
        }

        public async Task<ApiResponse<CustomerCouponRequestDto>> GetByIdGenericAsync(int id)
        {
            var customer = await context.GetByAsync(x => x.Id == id, x => x.Redemptions);

            if (customer == null || customer.Id <= 0)
                return ApiResponse<CustomerCouponRequestDto>.OnFailer($"Record not found.");

            return ApiResponse<CustomerCouponRequestDto>.OnSuccess(MapDto(customer));
        }

        public async Task<ApiResponse> GetAllAsync(int customerId)
        {
            List<Domain.Entities.CustomerCoupon> customer = await context.GetAllAsync(customerId);

            if (customer == null && customer.Count <= 0)
                return ApiResponse.OnFailer($"Record not found.");

            return ApiResponse.OnSuccess("Record loaded successfully.", customer.Select(x => MapDto(x)).ToList());
        }

        private CustomerCoupon MapDto(CustomerCouponRequestDto request)
        {
            var Customer = new CustomerCoupon()
            {
                Id = request.Id,
                RestaurantBranchId = request.RestaurantBranchId,
                CustomerId = request.CustomerId,
                CouponNumber = request.CouponNumber,
                CouponType = request.CouponType,
                Price = request.Price,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                IsActive = true
            };
            return Customer;
        }

        private CustomerCouponRequestDto MapDto(CustomerCoupon obj)
        {
            int totalPass = Convert.ToInt32((obj.EndDate - obj.StartDate).TotalDays) + 1;
            int usagePass = obj.Redemptions.Count(x => !x.IsDeleted && x.RedemptionDate.Month == DateTime.Now.Month);
            int remainingPass = totalPass - usagePass;
            return new CustomerCouponRequestDto(obj.Id, obj.RestaurantBranchId, obj.CustomerId, obj.CouponNumber, obj.CouponType, obj.Price, obj.StartDate, obj.EndDate, totalPass, usagePass, remainingPass);
        }
    }
}
