using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SemestreController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SemestreController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/semestre
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Semestre>>> GetSemestres()
        {
            return await _context.Semestres.ToListAsync();
        }

        // GET: api/semestre/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Semestre>> GetSemestre(int id)
        {
            var semestre = await _context.Semestres.FindAsync(id);

            if (semestre == null)
                return NotFound("Semestre non trouvé");

            return semestre;
        }

        // POST: api/semestre
        [HttpPost]
        public async Task<ActionResult<Semestre>> CreateSemestre(Semestre semestre)
        {
            _context.Semestres.Add(semestre);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetSemestre),
                new { id = semestre.Id },
                semestre
            );
        }

        // PUT: api/semestre/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSemestre(int id, Semestre semestre)
        {
            if (id != semestre.Id)
                return BadRequest("ID incorrect");

            _context.Entry(semestre).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Semestres.Any(e => e.Id == id))
                    return NotFound("Semestre non trouvé");

                throw;
            }

            return NoContent();
        }

        // DELETE: api/semestre/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSemestre(int id)
        {
            var semestre = await _context.Semestres.FindAsync(id);

            if (semestre == null)
                return NotFound("Semestre non trouvé");

            _context.Semestres.Remove(semestre);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}