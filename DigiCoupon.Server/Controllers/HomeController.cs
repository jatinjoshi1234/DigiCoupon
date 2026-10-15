using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Application.Interfaces.Services;
using DigiCoupon.Application.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DigiCoupon.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HomeController(IDashboardService context) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            DashboardVM result = await context.GetDashboardAsync(id);
            ApiResponse response = ApiResponse.OnSuccess("Dashboard data loaded successfully.", result);
            return Ok(response);
        }
    }
}
