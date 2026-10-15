using DigiCoupon.Application.DTO;
using DigiCoupon.Application;
using DigiCoupon.Application.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using System.Security.Claims;
using DigiCoupon.Application.Interfaces.Services;

namespace DigiCoupon.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AccountController(IUserService service) : ControllerBase
    {
        // ── Public endpoints (no auth required) ─────────────────────────────

        /// <summary>POST api/auth/login — Authenticate user and return JWT + session data.</summary>
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginRequestDto args) =>
            Ok(await service.LoginAsync(args));

        /// <summary>POST api/auth/register — Create new account and return JWT + session data.</summary>
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequestDto args) =>
            Ok(await service.RegisterAsync(args));

        /// <summary>POST api/auth/forgot-password — Request a password reset link.</summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPasswordAsync([FromBody] ForgotPasswordRequestDto args) =>
            Ok(await service.ForgotPasswordAsync(args));

        // ── Protected endpoints (requires valid JWT) ─────────────────────────

        /// <summary>GET api/auth/me — Return current authenticated user profile + restaurant info.</summary>
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> MeAsync()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                           ?? User.FindFirstValue("nameid")
                           ?? User.FindFirstValue("sub");

            if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(ApiResponse.OnFailer("Unable to identify authenticated user.", StatusCodes.Status401Unauthorized));

            var result = await service.GetCurrentUserAsync(userId);
            return Ok(result);
        }

        /// <summary>PUT api/auth/me — Update current authenticated user's profile (name, email, mobile).</summary>
        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMeAsync([FromBody] RegisterRequestDto args)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                           ?? User.FindFirstValue("nameid")
                           ?? User.FindFirstValue("sub");

            if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(ApiResponse.OnFailer("Unable to identify authenticated user.", StatusCodes.Status401Unauthorized));

            var result = await service.UpdateUserAsync(userId, args);
            return Ok(result);
        }

        /// <summary>POST api/auth/logout — Perform server-side logout (update last activity).</summary>
        [Authorize]
        [HttpPost("logout")]
        public IActionResult LogoutAsync()
        {
            // JWT is stateless — client discards the token.
            // Server-side: we acknowledge the logout. If you add a token blacklist / refresh-token
            // table in the future, invalidate it here.
            return Ok(ApiResponse.OnSuccess("Logged out successfully."));
        }

        /// <summary>POST api/auth/change-password — Change the authenticated user's password.</summary>
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordRequestDto args)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                           ?? User.FindFirstValue("nameid")
                           ?? User.FindFirstValue("sub");

            if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(ApiResponse.OnFailer("Unable to identify authenticated user.", StatusCodes.Status401Unauthorized));

            var result = await service.ChangePasswordAsync(userId, args);
            return Ok(result);
        }
    }
}
