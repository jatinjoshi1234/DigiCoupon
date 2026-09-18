using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public class SelectList
    {
        public SelectList(Guid id, string text)
        {
            Id = id;
            Text = text;
        }

        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
