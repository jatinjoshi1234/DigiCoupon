using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public record CustomerRequestDto(
        int Id,
        int RestaurantId,
        int? RestaurantBranchId,
        string FirstName,
        string? LastName,
        string? NickName,
        string Mobile,
        string? MemberCode,
        string PublicToken
    );

    public class CustomerVM
    {
        public int CustomerId { get; set; }
        public string Name { get; set; }
        public string NickName { get; set; }
        public string Mobile { get; set; }
        public bool IsActive { get; set; }
        public int PassId { get; set; }
        public string PublicToken { get; set; }
        public int Total { get; set; }
        public int TotalPass { get; set; }
        public int Usage { get; set; }
        public int Remaining { get; set; }
        public decimal Price { get; set; }
    }
}
