using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Shared.Exceptions;
using DigiCoupon;

using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace DigiCoupon.Server.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(
               RequestDelegate next,
               ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                //context.Response.Clear();
                //context.Response.ContentType = "application/json";
                //await context.Response.WriteAsJsonAsync(new ApiResponse(false, ex.Message.ToString()));
                Console.WriteLine(ex.Message);
                //switch (ex)
                //{
                //    case ValidationException:
                //    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                //    await context.Response.WriteAsJsonAsync(new ApiResponse(false, ex.Message));
                //    break;

                //    case NotFoundException:
                //    context.Response.StatusCode = StatusCodes.Status404NotFound;
                //    await context.Response.WriteAsJsonAsync(new ApiResponse(false, ex.Message));
                //    break;

                //    case UnauthorizedException:
                //    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                //    await context.Response.WriteAsJsonAsync(new ApiResponse(false, ex.Message));
                //    break;

                //    default:
                //    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                //    await context.Response.WriteAsJsonAsync(new ApiResponse(false, "Internal server error.Please try again later."));
                //    break;
                //}
                
            }
        }

    }
}
