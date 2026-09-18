using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.DTO
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<T> List { get; set; } = default!;
        public dynamic OtherData { get; set; } = default!;
        public static Result<T> OnSuccess(T data, string Message = "Success") => new()
        {
            IsSuccess = true,
            Message = Message,
            Data = data
        };
        public static Result<T> OnSuccess(List<T> data,dynamic otherData,string message = "") => new()
        {
            IsSuccess = true,
            Message = message,
            List = data,
            OtherData = otherData
        };

        public static Result<T> OnSuccess(List<T> data) => new()
        {
            IsSuccess = true,
            List = data
        };

        public static Result<T> OnFailure(string Message) => new()
        {
            IsSuccess = false,
            Message = Message
        };
    }
}
