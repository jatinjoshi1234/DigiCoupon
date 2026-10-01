using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Interfaces.Repositories;
using DigiCoupon.Application.Interfaces.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DigiCoupon.Server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class CustomerCouponController(ICustomerCouponService service) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await service.GetByIdGenericAsync(id);
            return Ok(result);
        }

        [HttpGet("all/{customerId:int}")]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            var result = await service.GetAllAsync(customerId);
            return Ok(result);
        }

        // POST api/<RestuarantController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CustomerCouponRequestDto args)
        {
            var res = await service.AddAsync(args);
            return Ok(res);
        }

        // PUT api/<RestuarantController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CustomerCouponRequestDto args)
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
