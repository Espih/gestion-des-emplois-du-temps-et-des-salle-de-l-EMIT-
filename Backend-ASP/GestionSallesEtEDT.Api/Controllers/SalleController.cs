using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GestionSallesEtEDT.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SalleController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/salle
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Salle>>> GetSalles()
        {
            return await _context.Salles.ToListAsync();
        }

        // GET: api/salle/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Salle>> GetSalle(int id)
        {
            var salle = await _context.Salles.FindAsync(id);

            if (salle == null)
            {
                return NotFound("Salle non trouvée");
            }

            return salle;
        }

        // POST: api/salle
        [HttpPost]
        public async Task<ActionResult<Salle>> CreateSalle(Salle salle)
        {
            _context.Salles.Add(salle);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSalle), new { id = salle.Id }, salle);
        }

        // PUT: api/salle/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSalle(int id, Salle salle)
        {
            if (id != salle.Id)
            {
                return BadRequest();
            }

            _context.Entry(salle).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/salle/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSalle(int id)
        {
            var salle = await _context.Salles.FindAsync(id);

            if (salle == null)
            {
                return NotFound();
            }

            _context.Salles.Remove(salle);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}