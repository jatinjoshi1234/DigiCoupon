using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace DigiCoupon.Application.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class BindParamAttribute:Attribute
    {
        public string? Name { get; set; }
        public DbType? DbType { get; set; }
        public ParameterDirection Direction { get; set; } = ParameterDirection.Input;
        public int? Size { get; set; }
        public BindParamAttribute() { }
        public BindParamAttribute(string name)
        {
            Name = name;
        }
    }
}
