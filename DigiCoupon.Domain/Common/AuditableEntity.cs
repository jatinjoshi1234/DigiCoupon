using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Domain.Common
{
    public class AuditableEntity : BaseEntity
    {
        public DateTime CreatedOn { get; set; }
        public int? UserId { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedOn { get; set; }
        public int? DeletedBy { get; set; }
    }
}
