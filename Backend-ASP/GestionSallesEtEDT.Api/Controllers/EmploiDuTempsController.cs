using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;
using GestionSallesEtEDT.Api.DTOs;

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
        public async Task<ActionResult<IEnumerable<EmploiDuTempsDto>>> GetEmploisDuTemps()
        {
            var emplois = await _context.EmploisDuTemps
                .Include(e => e.Classe)
                .Include(e => e.AnneeUniversitaire)
                .Include(e => e.Semestre)
                .Select(e => new EmploiDuTempsDto
                {
                    IdEdt = e.IdEdt,
                    Libelle = e.Libelle,
                    DateCreation = e.DateCreation,
                    DateModification = e.DateModification,
                    Statut = e.Statut,
                    IdClasse = e.IdClasse,
                    IdAnnee = e.IdAnnee,
                    IdSemestre = e.IdSemestre,
                    ClasseNom = e.Classe.Nom,
                    NiveauClasse = e.Classe.Niveau,
                    AnneeLibelle = e.AnneeUniversitaire.Libelle,
                    SemestreNom = e.Semestre.Nom
                })
                .ToListAsync();

            return Ok(emplois);
        }

        // GET: api/EmploiDuTemps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmploiDuTempsDto>> GetEmploiDuTemps(int id)
        {
            var e = await _context.EmploisDuTemps
                .Include(e => e.Classe)
                .Include(e => e.AnneeUniversitaire)
                .Include(e => e.Semestre)
                .FirstOrDefaultAsync(e => e.IdEdt == id);

            if (e == null)
                return NotFound("Emploi du temps non trouvé");

            var dto = new EmploiDuTempsDto
            {
                IdEdt = e.IdEdt,
                Libelle = e.Libelle,
                DateCreation = e.DateCreation,
                DateModification = e.DateModification,
                Statut = e.Statut,
                IdClasse = e.IdClasse,
                IdAnnee = e.IdAnnee,
                IdSemestre = e.IdSemestre,
                ClasseNom = e.Classe?.Nom,
                NiveauClasse = e.Classe?.Niveau,
                AnneeLibelle = e.AnneeUniversitaire?.Libelle,
                SemestreNom = e.Semestre?.Nom
            };

            return Ok(dto);
        }

        // POST: api/EmploiDuTemps
        [HttpPost]
        public async Task<ActionResult<EmploiDuTempsDto>> CreateEmploiDuTemps(EmploiDuTempsCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var emploi = new EmploiDuTemps
            {
                Libelle = dto.Libelle,
                IdClasse = dto.IdClasse,
                IdAnnee = dto.IdAnnee,
                IdSemestre = dto.IdSemestre,
                Statut = dto.Statut,
                DateCreation = DateOnly.FromDateTime(DateTime.UtcNow),
                DateModification = DateOnly.FromDateTime(DateTime.UtcNow)
            };

            _context.EmploisDuTemps.Add(emploi);
            await _context.SaveChangesAsync();

            return await GetEmploiDuTemps(emploi.IdEdt);
        }

        // PUT: api/EmploiDuTemps/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmploiDuTemps(int id, EmploiDuTempsUpdateDto dto)
        {
            var emploi = await _context.EmploisDuTemps.FindAsync(id);
            if (emploi == null)
                return NotFound("Emploi du temps non trouvé");

            emploi.Libelle = dto.Libelle;
            emploi.Statut = dto.Statut;
            emploi.DateModification = DateOnly.FromDateTime(DateTime.UtcNow);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/EmploiDuTemps/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmploiDuTemps(int id)
        {
            var emploi = await _context.EmploisDuTemps.FindAsync(id);
            if (emploi == null)
                return NotFound();

            _context.EmploisDuTemps.Remove(emploi);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}