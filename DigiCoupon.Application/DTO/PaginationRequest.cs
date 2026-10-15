using DigiCoupon.Application.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public class PaginationRequest
    {
        [BindParam("Page")]
        public int Page { get; set; } = 1;
        [BindParam("PageSize")]
        public int PageSize { get; set; } = 10;
        [BindParam("Search")]
        public string? Search { get; set; }
        [BindParam("OtherData")]
        public int Data { get; set; } = default!;
    }
    public class PaginationResponse<T>
    {
        public List<T> Items { get; set; } = new(); 
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalRecords { get; set; }
    }
}
