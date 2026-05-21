using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmploiDuTempsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmploiDuTempsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/EmploiDuTemps
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmploiDuTemps>>> GetEmploisDuTemps()
        {
            return await _context.EmploisDuTemps
                .Include(e => e.Classe)
                .Include(e => e.AnneeUniversitaire)
                .Include(e => e.Semestre)
                .ToListAsync();
        }

        // GET: api/EmploiDuTemps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmploiDuTemps>> GetEmploiDuTemps(int id)
        {
            var emploi = await _context.EmploisDuTemps
                .Include(e => e.Classe)
                .Include(e => e.AnneeUniversitaire)
                .Include(e => e.Semestre)
                .FirstOrDefaultAsync(e => e.IdEdt == id);

            if (emploi == null)
                return NotFound("Emploi du temps non trouvé");

            return emploi;
        }

        
        // POST: api/EmploiDuTemps
        [HttpPost]
        public async Task<ActionResult<EmploiDuTemps>> CreateEmploiDuTemps(EmploiDuTemps emploi)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validation des IDs obligatoires
            if (emploi.IdClasse <= 0 || emploi.IdAnnee <= 0 || emploi.IdSemestre <= 0)
                return BadRequest("Les champs IdClasse, IdAnnee et IdSemestre sont obligatoires.");

            // Gestion automatique des dates
            emploi.DateCreation = DateOnly.FromDateTime(DateTime.UtcNow);
            emploi.DateModification = DateOnly.FromDateTime(DateTime.UtcNow);

            // IMPORTANT : On détache les objets de navigation pour éviter les erreurs de validation
            emploi.Classe = null!;
            emploi.AnneeUniversitaire = null!;
            emploi.Semestre = null!;

            _context.EmploisDuTemps.Add(emploi);
            await _context.SaveChangesAsync();

            // Retourner l'objet complet avec les relations chargées
            var emploiCree = await _context.EmploisDuTemps
                .Include(e => e.Classe)
                .Include(e => e.AnneeUniversitaire)
                .Include(e => e.Semestre)
                .FirstOrDefaultAsync(e => e.IdEdt == emploi.IdEdt);

            return CreatedAtAction(nameof(GetEmploiDuTemps), new { id = emploi.IdEdt }, emploiCree);
        }

        // PUT & DELETE restent les mêmes que précédemment
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmploiDuTemps(int id, EmploiDuTemps emploi)
        {
            if (id != emploi.IdEdt)
                return BadRequest("ID incorrect");

            _context.Entry(emploi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.EmploisDuTemps.Any(e => e.IdEdt == id))
                    return NotFound("Emploi du temps non trouvé");
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmploiDuTemps(int id)
        {
            var emploi = await _context.EmploisDuTemps.FindAsync(id);
            if (emploi == null)
                return NotFound("Emploi du temps non trouvé");

            _context.EmploisDuTemps.Remove(emploi);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}