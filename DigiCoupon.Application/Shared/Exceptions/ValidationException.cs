using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.Shared.Exceptions
{
    public sealed class ValidationException : Exception
    {
        
        public ValidationException(string message):base(message) { }
    }
}
