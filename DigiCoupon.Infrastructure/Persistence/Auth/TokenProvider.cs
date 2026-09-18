using DigiCoupon.Application.Interfaces.Auth;
using DigiCoupon.Domain.Entities;

using DigiCoupon.Domain;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DigiCoupon.Infrastrucure.Persistence.Auth
{
    public class TokenProvider(IOptions<TokenSettings> tokenSettings):ITokenProvider
    {
        private readonly TokenSettings _settings = tokenSettings.Value;
        public async Task<string> GenerateToken(Users user)
        {
            var claim = new List<Claim>(){
                new Claim(ClaimTypes.Name,$"{user.Name}"),
                new Claim(ClaimTypes.NameIdentifier,$"{user.Id}"),
                new Claim(ClaimTypes.Email,$"{user.Email}")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Key));
            var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var secToken = new JwtSecurityToken(
                    issuer: _settings.Issuer,
                    audience: _settings.Audience,
                    claims: claim,
                    expires: DateTime.Now.AddMinutes(_settings.Duration),
                    signingCredentials: credential);

            var token = new JwtSecurityTokenHandler().WriteToken(secToken);
            return token;
        }
    }
}
