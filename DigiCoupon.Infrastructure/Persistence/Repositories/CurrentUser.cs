using DigiCoupon.Application.Interfaces;

using Microsoft.AspNetCore.Http;

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace DigiCoupon.Infrastrucure.Persistence.Repositories
{
    public class CurrentUser(IHttpContextAccessor accessor):ICurrentUser
    {
        public int UserId => int.TryParse(accessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId) ? userId : -1;
    }
}
