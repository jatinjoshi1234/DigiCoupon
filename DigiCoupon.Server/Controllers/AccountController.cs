using DigiCoupon.Application.DTO;
using DigiCoupon.Application;

using Microsoft.AspNetCore.Mvc;
using DigiCoupon.Application.Interfaces.Services;

namespace DigiCoupon.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AccountController(IUserService service) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginRequestDto args) => Ok(await service.LoginAsync(args));

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequestDto args) => Ok(await service.RegisterAsync(args));
    }
}
