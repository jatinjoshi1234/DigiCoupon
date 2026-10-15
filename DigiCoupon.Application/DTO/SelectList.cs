using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public class SelectList
    {
        public SelectList(){

        }
        //public SelectList(int id, string text)
        //{
        //    Id = id;
        //    Text = text;
        //}

        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
