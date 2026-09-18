using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public record RestuarantRequestDto(int Id,string Name, string Email, string Mobile,string? FssaiLicenseNo, string? Address);
    
    public record RestuarantBranchDto(int Id, int RestaurantId, string BranchName, string Address, string City, string? State, string? Pincode, string Mobile,string Email);
}
