using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnseignantController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EnseignantController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Enseignant
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Enseignant>>> GetEnseignants()
        {
            return await _context.Enseignants
                .Include(e => e.Utilisateur)
                .ToListAsync();
        }

        // GET: api/Enseignant/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Enseignant>> GetEnseignant(int id)
        {
            var enseignant = await _context.Enseignants
                .Include(e => e.Utilisateur)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (enseignant == null)
                return NotFound("Enseignant non trouvé");

            return enseignant;
        }

        // POST: api/Enseignant
        [HttpPost]
        public async Task<ActionResult<Enseignant>> CreateEnseignant(Enseignant enseignant)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(enseignant.Nom))
                return BadRequest("Le nom de l'enseignant est obligatoire.");

            var nouvelEnseignant = new Enseignant
            {
                Nom = enseignant.Nom,
                Prenom = enseignant.Prenom,
                Email = enseignant.Email,
                Telephone = enseignant.Telephone
            };

            _context.Enseignants.Add(nouvelEnseignant);
            await _context.SaveChangesAsync();

            // Retourner avec la relation
            var enseignantCree = await _context.Enseignants
                .Include(e => e.Utilisateur)
                .FirstOrDefaultAsync(e => e.Id == nouvelEnseignant.Id);

            return CreatedAtAction(
                nameof(GetEnseignant),
                new { id = enseignantCree!.Id },
                enseignantCree
            );
        }

        // PUT: api/Enseignant/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEnseignant(int id, Enseignant enseignant)
        {
            if (id != enseignant.Id)
                return BadRequest("ID incorrect");

            var existing = await _context.Enseignants.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Nom = enseignant.Nom;
            existing.Prenom = enseignant.Prenom;
            existing.Email = enseignant.Email;
            existing.Telephone = enseignant.Telephone;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Enseignant/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnseignant(int id)
        {
            var enseignant = await _context.Enseignants.FindAsync(id);
            if (enseignant == null)
                return NotFound();

            _context.Enseignants.Remove(enseignant);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}