using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ========================================
        // GET ALL
        // ========================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Seance>>> GetSeances()
        {
            return await _context.Seances
                .Include(s => s.Salle)
                .Include(s => s.Matiere)
                .Include(s => s.Enseignant)
                .Include(s => s.Classe)
                .Include(s => s.Semestre)
                .ToListAsync();
        }

        // ========================================
        // GET BY ID
        // ========================================

        [HttpGet("{id}")]
        public async Task<ActionResult<Seance>> GetSeance(int id)
        {
            var seance = await _context.Seances
                .Include(s => s.Salle)
                .Include(s => s.Matiere)
                .Include(s => s.Enseignant)
                .Include(s => s.Classe)
                .Include(s => s.Semestre)
                .FirstOrDefaultAsync(s => s.id_seance == id);

            if (seance == null)
                return NotFound("Séance non trouvée");

            return seance;
        }

        // ========================================
        // CREATE
        // ========================================

        [HttpPost]
        public async Task<ActionResult<Seance>> CreateSeance(Seance seance)
        {
            // =========================
            // VERIFICATION SALLE
            // =========================

            bool salleOccupee = await _context.Seances.AnyAsync(s =>
                s.jour == seance.jour &&
                s.id_salle == seance.id_salle &&
                seance.heure_debut < s.heure_fin &&
                seance.heure_fin > s.heure_debut
            );

            if (salleOccupee)
            {
                return BadRequest("La salle est déjà occupée.");
            }

            // =========================
            // VERIFICATION ENSEIGNANT
            // =========================

            bool enseignantOccupe = await _context.Seances.AnyAsync(s =>
                s.jour == seance.jour &&
                s.id_enseignant == seance.id_enseignant &&
                seance.heure_debut < s.heure_fin &&
                seance.heure_fin > s.heure_debut
            );

            if (enseignantOccupe)
            {
                return BadRequest("L'enseignant est déjà occupé.");
            }

            _context.Seances.Add(seance);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetSeance),
                new { id = seance.id_seance },
                seance
            );
        }

        // ========================================
        // UPDATE
        // ========================================

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSeance(int id, Seance seance)
        {
            if (id != seance.id_seance)
                return BadRequest();

            _context.Entry(seance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Seances.Any(e => e.id_seance == id))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        // ========================================
        // DELETE
        // ========================================

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeance(int id)
        {
            var seance = await _context.Seances.FindAsync(id);

            if (seance == null)
                return NotFound();

            _context.Seances.Remove(seance);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}