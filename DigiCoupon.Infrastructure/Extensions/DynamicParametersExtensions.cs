using Dapper;
using DigiCoupon.Application.Attributes;
using System;
using System.Collections.Generic;
using System.Data;
using System.Reflection;
using System.Text;

namespace DigiCoupon.Infrastructure.Extensions
{
    public static class DynamicParametersExtensions
    {
        public static DynamicParameters ToDynamicParameters<T>(this T source) where T : class
        {
            var parameters = new DynamicParameters();
            if (source == null) return parameters;

            var type = source.GetType();

            foreach (var prop in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                var attr = prop.GetCustomAttribute<BindParamAttribute>();

                if (attr == null)
                    continue;

                string paramName = attr.Name ?? $"@{prop.Name}";

                if (!paramName.StartsWith("@"))
                    paramName = "@" + paramName;

                var value = prop.GetValue(source);

                parameters.Add(
                    name: paramName,
                    value: value,
                    dbType: attr.DbType,
                    direction: attr.Direction,
                    size: attr.Size
                );
            }

            return parameters;
        }

        public static void ReadOutputParameters<T>(this T source, DynamicParameters parameters) where T : class
        {
            if (source == null || parameters == null) return;

            var type = typeof(T);
            foreach (var prop in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                var attr = prop.GetCustomAttribute<BindParamAttribute>();
                // Only read back properties designated as Output or InputOutput
                if (attr == null || (attr.Direction != ParameterDirection.Output && attr.Direction != ParameterDirection.InputOutput))
                {
                    continue;
                }

                string paramName = attr.Name ?? $"@{prop.Name}";
                if (!paramName.StartsWith("@")) paramName = "@" + paramName;

                // Fetch the updated value from Dapper and assign it back to the property
                try
                {
                    var val = parameters.Get<object>(paramName);
                    if (val != null && val != DBNull.Value)
                    {
                        // Convert to target property type safely
                        var convertedVal = Convert.ChangeType(val, prop.PropertyType);
                        prop.SetValue(source, convertedVal);
                    }
                }
                catch
                {
                    // Parameter might not exist or wasn't populated
                }
            }
        }
    }
}
