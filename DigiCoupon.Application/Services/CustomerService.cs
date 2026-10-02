using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Interfaces.Auth;
using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Application.Interfaces.Services;
using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Xml.Linq;

namespace DigiCoupon.Application.Services
{
    public class CustomerService(ICustomers context) : ICustomerService
    {
        public async Task<ApiResponse> AddAsync(CustomerRequestDto request)
        {
            bool isExists = await context.AnyAsync(x => x.Mobile == request.Mobile);

            if (isExists)
                return ApiResponse.OnFailer($"{request.Mobile} allready registered.");

            var result = await context.AddAsync(MapDto(request));
            return result > 0 ? ApiResponse.OnSuccess("Redord added successfully.") : ApiResponse.OnSuccess("Enter details are invalid. Please enter correct details");
        }

        public async Task<ApiResponse> UpdateAsync(int id, CustomerRequestDto request)
        {
            bool isExists = await context.AnyAsync(x => x.Id != request.Id && x.Mobile == request.Mobile);

            if (isExists)
                return ApiResponse.OnFailer($"{request.Mobile} allready registered. Please try with another mobile no.");

            isExists = await context.AnyAsync(x => x.Id == id);

            if (!isExists)
                return ApiResponse.OnFailer($"Record not found.");

            var result = await context.UpdateAsync(MapDto(request));
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

        public async Task<ApiResponse> GetAllAsync(int restuarantId,int branchId = 0)
        {
            List<Domain.Entities.Customers> customer = await context.GetAllAsync(restuarantId, branchId);

            if (customer == null && customer.Count <= 0)
                return ApiResponse.OnFailer($"Record not found.");

            return ApiResponse.OnSuccess("Record loaded successfully.", customer.Select(x => MapDto(x)).ToList());
        }

        public async Task<ApiResponse> GetByRestaurantAsync(int restuarantId)
        {
            IEnumerable<CustomerVM> customer = await context.GetCustomerByRestaurant<CustomerVM>(restuarantId);

            if (customer == null || customer.Count() <= 0)
                return ApiResponse.OnFailer($"Record not found.");

            return ApiResponse.OnSuccess("Record loaded successfully.", customer);
        }

        private Customers MapDto(CustomerRequestDto request)
        {
            var Customer = new Customers()
            {
                Id = request.Id,
                RestaurantId = request.RestaurantId,
                RestaurantBranchId = request.RestaurantBranchId,
                FirstName = request.FirstName,
                LastName = request.LastName,
                NickName = request.NickName,
                Mobile = request.Mobile,
                //MemberCode = request.MemberCode,
                //PublicToken = request.PublicToken,
                //IsActive = request.IsActive
            };
            return Customer;
        }

        private CustomerRequestDto MapDto(Customers obj)
        {
            return new CustomerRequestDto(obj.Id,obj.RestaurantId, obj.RestaurantBranchId, obj.FirstName, obj.LastName, obj.NickName, obj.Mobile);
        }
    }
}
