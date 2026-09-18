using DigiCoupon.Application.Interfaces.Auth;
using DigiCoupon.Domain.Entities;

using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Infrastrucure.Persistence.Security
{
    public class PasswordProvider: IPasswordProvider
    {
        private readonly PasswordHasher<Users> _hasher = new();
        public Task<string> Hash(Users user, string password) => Task.FromResult(_hasher.HashPassword(user, password));
        public Task<bool> Verify(Users user, string password, string hashPassword) => Task.FromResult(_hasher.VerifyHashedPassword(user, hashPassword, password) == PasswordVerificationResult.Success);
    }
}
