using DigiCoupon.Domain.Entities;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Auth
{
    public interface IPasswordProvider
    {
        public Task<string> Hash(Users user, string password);
        public Task<bool> Verify(Users user, string password, string hashPassword);
    }
}
