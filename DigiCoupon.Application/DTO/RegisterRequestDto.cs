using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public record RegisterRequestDto(string Name, string Email, string Mobile, string Password);

    public record LoginRequestDto(string UserName, string Password);
}
