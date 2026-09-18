using DigiCoupon.Application.DTO;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public class ApiResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public dynamic Data { get; set; } = default!;
        public ApiResponse(){ }
        public ApiResponse(bool status, string message)
        {
            Status = status;
            Message = message;
        }
        public ApiResponse(string message)
        {
            Status = false;
            Message = message;
        }
        public ApiResponse(dynamic data)
        {
            Status = true;
            Data = data;
        }

        public static ApiResponse OnSuccess(string message) => new ApiResponse()
        {
            Status = true,
            Message = message
        };

        public static ApiResponse OnSuccess(string message,dynamic data) => new ApiResponse()
        {
            Status = true,
            Message = message,
            Data = data
        };

        public static ApiResponse OnFailer(string message) => new ApiResponse()
        {
            Status = false,
            Message = message
        };

    }

}
