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
                _logger.LogError(ex, "{Message}", ex.Message);

                if (context.Response.HasStarted)
                {
                    _logger.LogWarning("The response has already started, the exception handling middleware cannot write a response.");
                    throw;
                }

                int statusCode = ex switch
                {
                    ValidationException => StatusCodes.Status400BadRequest,
                    NotFoundException => StatusCodes.Status404NotFound,
                    UnauthorizedException => StatusCodes.Status401Unauthorized,
                    _ => StatusCodes.Status500InternalServerError
                };

                string message = ex switch
                {
                    ValidationException or NotFoundException or UnauthorizedException => ex.Message,
                    _ => "Internal server error please try again after some time."
                };

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = statusCode;

                await context.Response.WriteAsJsonAsync(new ApiResponse(false, message) { Code = statusCode });
            }
        }

    }
}
