using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Infrastrucure.Persistence.Auth
{
    public class TokenSettings
    {
        public int Duration { get; set; }
        public string Issuer { get; set; }=string.Empty;
        public string Audience { get; set; }= string.Empty;
        public string Key { get; set; } = string.Empty;
    }
}
