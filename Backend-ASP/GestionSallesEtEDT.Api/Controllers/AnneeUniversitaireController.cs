using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnneeUniversitaireController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnneeUniversitaireController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/anneeuniversitaire
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnneeUniversitaire>>> GetAnnees()
        {
            return await _context.AnneesUniversitaires.ToListAsync();
        }

        // GET: api/anneeuniversitaire/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AnneeUniversitaire>> GetAnnee(int id)
        {
            var annee = await _context.AnneesUniversitaires.FindAsync(id);

            if (annee == null)
                return NotFound("Année universitaire non trouvée");

            return annee;
        }

        // POST: api/anneeuniversitaire
        [HttpPost]
        public async Task<ActionResult<AnneeUniversitaire>> CreateAnnee(AnneeUniversitaire annee)
        {
            _context.AnneesUniversitaires.Add(annee);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetAnnee),
                new { id = annee.Id },
                annee
            );
        }

        // PUT: api/anneeuniversitaire/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAnnee(int id, AnneeUniversitaire annee)
        {
            if (id != annee.Id)
                return BadRequest("ID incorrect");

            _context.Entry(annee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.AnneesUniversitaires.Any(e => e.Id == id))
                    return NotFound("Année universitaire non trouvée");

                throw;
            }

            return NoContent();
        }

        // DELETE: api/anneeuniversitaire/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnee(int id)
        {
            var annee = await _context.AnneesUniversitaires.FindAsync(id);

            if (annee == null)
                return NotFound("Année universitaire non trouvée");

            _context.AnneesUniversitaires.Remove(annee);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}