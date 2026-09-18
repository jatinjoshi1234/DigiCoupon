using DigiCoupon.Domain.Common;

using System;
using System.Collections.Generic;
using System.Text;

    namespace DigiCoupon.Domain.Entities
{
    public class Restaurant : AuditableEntity
    {
        public string Name { get; set; }

        public string? Email { get; set; }

        public string? Mobile { get; set; }
        
        public string? Address { get; set; }
        public string? FssaiLicenseNo { get; set; }
        public bool IsActive { get; set; } = true;


        // Navigation
        public Users User { get; set; } = default!;

        public ICollection<RestaurantBranch> Branches { get; set; }
    }
}
