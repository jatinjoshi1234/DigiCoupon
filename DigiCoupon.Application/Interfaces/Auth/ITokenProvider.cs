using DigiCoupon.Domain.Entities;



using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Auth
{
    public interface ITokenProvider
    {
        public Task<string> GenerateToken(Users user);
    }
}
