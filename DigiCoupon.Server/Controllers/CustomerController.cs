using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Application.Interfaces.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DigiCoupon.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomerController(ICustomerService service) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await service.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpGet("all/{restuarantId}/{branchId?}")]
        public async Task<IActionResult> Get(int restuarantId, int? branchId = 0)
        {
            var result = await service.GetByRestaurantAsync(restuarantId);
            return Ok(result);
        }

        // POST api/<RestuarantController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CustomerRequestDto args)
        {
            var res = await service.AddAsync(args);
            return Ok(res);
        }

        // PUT api/<RestuarantController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CustomerRequestDto args)
        {
            var res = await service.UpdateAsync(id, args);
            return Ok(res);
        }

        // DELETE api/<RestuarantController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await service.DeleteAsync(id);
            return Ok(res);
        }
    }
}
