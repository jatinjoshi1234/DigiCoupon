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
        string MemberCode,
        string PublicToken,
        DateTime CreateOn,
        bool IsActive
    );
}
