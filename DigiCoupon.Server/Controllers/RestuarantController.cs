using DigiCoupon.Application.DTO;
using DigiCoupon.Application.Interfaces.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DigiCoupon.Server.Controllers
{

    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class RestuarantController(IRestaurantService service,IRestaurantBranchService branch) : ControllerBase
    {
        // GET: api/<RestuarantController>
        //[HttpGet]
        //public async Task<IActionResult> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        // GET api/<RestuarantController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await service.GetByIdAsync(id);
            return Ok(result);
        }

        // POST api/<RestuarantController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RestuarantRequestDto args)
        {
            Console.WriteLine("Post data => ", JsonSerializer.Serialize(args));
            var res = await service.AddAsync(args);
            return Ok(res); 
        }

        // PUT api/<RestuarantController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] RestuarantRequestDto args)
        {
            var res = await service.UpdateAsync(id,args);
            return Ok(res);
        }

        // DELETE api/<RestuarantController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var res = await service.DeleteAsync(id);
            return Ok(res);
        }


        // GET api/<RestuarantController>/5
        [HttpGet("branch/{id}")]
        public async Task<IActionResult> Branch(int id)
        {
            var result = await branch.GetByIdAsync(id);
            return Ok(result);
        }

        // GET api/<RestuarantController>/5
        [HttpGet("all_branch/{restuarant}")]
        public async Task<IActionResult> GetAllBranch(int restuarant)
        {
            var result = await branch.GetAllAsync(restuarant);
            return Ok(result);
        }

        // POST api/<RestuarantController>
        [HttpPost("branch")]
        public async Task<IActionResult> Branch([FromBody] RestuarantBranchDto args)
        {
            var res = await branch.AddAsync(args);
            return Ok(res);
        }

        // PUT api/<RestuarantController>/5
        [HttpPut("branch/{id}")]
        public async Task<IActionResult> Branch(int id, [FromBody] RestuarantBranchDto args)
        {
            var res = await branch.UpdateAsync(id, args);
            return Ok(res);
        }

        // DELETE api/<RestuarantController>/5
        [HttpDelete("branch/{id}")]
        public async Task<IActionResult> DeleteBranch(int id)
        {
            var res = await branch.DeleteAsync(id);
            return Ok(res);
        }
    }
}
