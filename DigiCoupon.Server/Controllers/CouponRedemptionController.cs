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
    public class CouponRedemptionController(ICouponRedemptionsService service) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await service.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpGet("all/{couponId:int}/{fromDate:datetime?}/{toDate:datetime?}")]
        public async Task<IActionResult> GetByCustomer(int couponId, DateTime? fromDate,DateTime? toDate)
        {
            var result = await service.GetAllAsync(couponId,fromDate, toDate);
            return Ok(result);
        }

        // POST api/<CouponRedemptionController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CouponRedemptionRequestDto args)
        {
            var res = await service.AddAsync(args);
            return Ok(res);
        }

        // PUT api/<CouponRedemptionController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CouponRedemptionRequestDto args)
        {
            var res = await service.UpdateAsync(id, args);
            return Ok(res);
        }

        // DELETE api/<CouponRedemptionController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await service.DeleteAsync(id);
            return Ok(res);
        }

        // DELETE api/<CouponRedemptionController>/5
        [HttpDelete("all/{id}")]
        public async Task<IActionResult> DeleteAll (int id)
        {
            var res = await service.DeleteByCouponAsync(id);
            return Ok(res);
        }
    }
}
