using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.Shared.Exceptions
{
    public sealed class UnauthorizedException:Exception
    {
        public UnauthorizedException(string message):base(message) { }
    }
}
