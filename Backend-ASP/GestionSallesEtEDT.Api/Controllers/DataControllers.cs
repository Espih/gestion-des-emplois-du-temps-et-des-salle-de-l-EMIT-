using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;
using GestionSallesEtEDT.Api.Services;

namespace GestionSallesEtEDT.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DataControllers : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ISeanceService _seanceService;
        private readonly IEdtPdfService _pdfService;

        public DataControllers(ApplicationDbContext context, ISeanceService seanceService, IEdtPdfService pdfService)
        {
            _context = context;
            _seanceService = seanceService;
            _pdfService = pdfService;
        }

        // ================= SEANCES (EDT) =================

        [HttpGet("seances")]
        public async Task<IActionResult> GetSeances()
        {
            var data = await _context.Seances
                .Include(s => s.Salle)
                .Include(s => s.Enseignant)
                .Include(s => s.Matiere)
                .Include(s => s.Classe!)               
                    .ThenInclude(c => c.Parcours!)   
                    .ThenInclude(p => p.Mention)
                .ToListAsync();
            return Ok(data);
        }

        [HttpPost("seances")]
        public async Task<IActionResult> CreateSeance([FromBody] Seance seance)
        {
            if (seance.IdClasse <= 0)
                return BadRequest(new { message = "La classe est obligatoire." });
            if (seance.IdMatiere <= 0)
                return BadRequest(new { message = "La matière est obligatoire." });
            if (seance.IdSalle <= 0)
                return BadRequest(new { message = "La salle est obligatoire." });
            if (seance.IdEnseignant <= 0)
                return BadRequest(new { message = "L'enseignant est obligatoire." });
            if (string.IsNullOrWhiteSpace(seance.Jour))
                return BadRequest(new { message = "Le jour est obligatoire." });
            if (string.IsNullOrWhiteSpace(seance.HeureDebut) || string.IsNullOrWhiteSpace(seance.HeureFin))
                return BadRequest(new { message = "Les horaires sont obligatoires." });

            try
            {
                if (await _seanceService.DetecterConflitAsync(seance))
                    return BadRequest(new { message = "Conflit planning détecté (Enseignant, Salle ou Classe déjà occupé)." });

                _context.Seances.Add(seance);
                await _context.SaveChangesAsync();
                return Ok(seance);
            }
            catch (Exception ex)
            {
                // Log détaillé pour voir l'erreur réelle
                Console.WriteLine($"[ERREUR CREATE SEANCE] {ex.GetType().Name}: {ex.Message}");
                if (ex.InnerException != null)
                    Console.WriteLine($"[INNER] {ex.InnerException.Message}");
                    
                return StatusCode(500, new { 
                    message = "Erreur interne.", 
                    detail = ex.Message 
                });
            }
        }

        [HttpPut("seances/{id}")]
        public async Task<IActionResult> UpdateSeance(int id, [FromBody] Seance seance)
        {
            if (id != seance.IdSeance) return BadRequest();
            if (seance.IdClasse <= 0)
                return BadRequest(new { message = "La classe est obligatoire." });
            if (seance.IdMatiere <= 0)
                return BadRequest(new { message = "La matière est obligatoire." });
            if (seance.IdSalle <= 0)
                return BadRequest(new { message = "La salle est obligatoire." });
            if (seance.IdEnseignant <= 0)
                return BadRequest(new { message = "L'enseignant est obligatoire." });

            if (await _seanceService.DetecterConflitAsync(seance))
                return BadRequest(new { message = "Conflit planning détecté lors de la modification." });

            _context.Entry(seance).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("seances/{id}")]
        public async Task<IActionResult> DeleteSeance(int id)
        {
            var s = await _context.Seances.FindAsync(id);
            if (s == null) return NotFound();
            _context.Seances.Remove(s);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ================= SALLES & DETAILS D'OCCUPATION =================

        [HttpGet("salles")]
        public async Task<IActionResult> GetSalles() => Ok(await _context.Salles.ToListAsync());

        [HttpGet("salles/{id}/details")]
        public async Task<IActionResult> GetSalleDetails(int id)
        {
            var salle = await _context.Salles.FindAsync(id);
            if (salle == null) return NotFound(new { message = "Salle introuvable." });

            var occupations = await _context.Seances
                .Where(s => s.IdSalle == id)
                .Include(s => s.Enseignant)
                .Include(s => s.Matiere)
                .Include(s => s.Classe!)
                    .ThenInclude(c => c.Parcours!)
                        .ThenInclude(p => p.Mention)
                .Select(s => new {
                    s.IdSeance,
                    s.Jour,
                    s.HeureDebut,
                    s.HeureFin,
                    Matiere = s.Matiere!.NomMatiere,
                    Enseignant = $"{s.Enseignant!.Civilite} {s.Enseignant.Nom}",
                    Classe = s.Classe!.Niveau,
                    Parcours = s.Classe.Parcours!.NomParcours,
                    Mention = s.Classe.Parcours.Mention!.NomMention,
                    Duree = s.HeureFin
                })
                .ToListAsync();

            return Ok(new { salle, occupations });
        }

        [HttpPost("salles")]
        public async Task<IActionResult> CreateSalle([FromBody] Salle salle)
        {
            _context.Salles.Add(salle);
            await _context.SaveChangesAsync();
            return Ok(salle);
        }

        [HttpPut("salles/{id}")]
        public async Task<IActionResult> UpdateSalle(int id, [FromBody] Salle salle)
        {
            if (id != salle.IdSalle) return BadRequest();
            _context.Entry(salle).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("salles/{id}")]
        public async Task<IActionResult> DeleteSalle(int id)
        {
            var s = await _context.Salles.FindAsync(id);
            if (s == null) return NotFound();
            _context.Salles.Remove(s);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Métadonnées nécessaires pour les listes déroulantes du formulaire de l'interface
        [HttpGet("meta")]
        public async Task<IActionResult> GetMetadata()
        {
            return Ok(new
            {
                mentions = await _context.Mentions.ToListAsync(),
                parcours = await _context.Parcours.ToListAsync(),
                classes = await _context.Classes.ToListAsync(),
                enseignants = await _context.Enseignants.ToListAsync(),
                matieres = await _context.Matieres.ToListAsync()
            });
        }
        
        // ================= EDT EN PDF =================

        [HttpGet("edt/pdf/{idClasse}")]
        public async Task<IActionResult> GenererEdtPdf(int idClasse)
        {
            var classe = await _context.Classes
                .Include(c => c.Parcours!)
                    .ThenInclude(p => p.Mention)
                .FirstOrDefaultAsync(c => c.IdClasse == idClasse);

            if (classe == null)
                return NotFound(new { message = "Classe introuvable" });

            var nomParcours = classe.Parcours?.NomParcours ?? "SansParcours";
            var nomMention = classe.Parcours?.Mention?.NomMention ?? "SansMention";
            var niveau = classe.Niveau ?? "SansNiveau";

            var seances = await _context.Seances
                .Where(s => s.IdClasse == idClasse)
                .Include(s => s.Salle)
                .Include(s => s.Enseignant)
                .Include(s => s.Matiere)
                .ToListAsync();

            var sallePrincipale = seances
                .GroupBy(s => s.Salle?.NomSalle)
                .OrderByDescending(g => g.Count())
                .FirstOrDefault()?.Key ?? "N/A";

            var data = new EdtPdfData
            {
                AnneeUniversitaire = $"{DateTime.Now.Year}-{DateTime.Now.Year + 1}",
                Mention = nomMention,
                Parcours = nomParcours,
                Niveau = niveau,
                SallePrincipale = sallePrincipale,
                Seances = seances
            };

            var pdf = _pdfService.GenererEdtPdf(data);

            var parcoursSafe = SanitizeFileName(nomParcours);
            var niveauSafe = SanitizeFileName(niveau);
            var fileName = $"EDT_{parcoursSafe}_{niveauSafe}.pdf";

            Console.WriteLine($"[PDF] Génération : {fileName}");
            Console.WriteLine($"[PDF] Parcours='{nomParcours}' / Niveau='{niveau}'");

            return File(pdf, "application/pdf", fileName);
        }

        private static string SanitizeFileName(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return "Sans";
            
            var invalidChars = System.IO.Path.GetInvalidFileNameChars();
            var sanitized = new string(name.Select(c =>
                invalidChars.Contains(c) || c == ' ' || c == '\'' || c == '/' || c == '\\' 
                    ? '_' 
                    : c
            ).ToArray());
            return sanitized.Trim('_');
        }
    }
}