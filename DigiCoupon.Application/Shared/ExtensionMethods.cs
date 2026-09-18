using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.Shared
{
    public static class ExtensionMethods
    {
        public static bool HashItem<T>(this List<T> args)
        {
            return args!=null && args.Any();
        }
    }
}
