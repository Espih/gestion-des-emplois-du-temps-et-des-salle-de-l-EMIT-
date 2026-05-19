using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatiereController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MatiereController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/matiere
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Matiere>>> GetMatieres()
        {
            return await _context.Matieres.ToListAsync();
        }

        // GET: api/matiere/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Matiere>> GetMatiere(int id)
        {
            var matiere = await _context.Matieres.FindAsync(id);

            if (matiere == null)
                return NotFound("Matière non trouvée");

            return matiere;
        }

        // POST: api/matiere
        [HttpPost]
        public async Task<ActionResult<Matiere>> CreateMatiere(Matiere matiere)
        {
            _context.Matieres.Add(matiere);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetMatiere),
                new { id = matiere.Id },
                matiere
            );
        }

        // PUT: api/matiere/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMatiere(int id, Matiere matiere)
        {
            if (id != matiere.Id)
                return BadRequest("ID incorrect");

            _context.Entry(matiere).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Matieres.Any(e => e.Id == id))
                    return NotFound("Matière non trouvée");

                throw;
            }

            return NoContent();
        }

        // DELETE: api/matiere/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatiere(int id)
        {
            var matiere = await _context.Matieres.FindAsync(id);

            if (matiere == null)
                return NotFound("Matière non trouvée");

            _context.Matieres.Remove(matiere);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}