using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClasseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClasseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ====================================
        // GET ALL
        // ====================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Classe>>> GetClasses()
        {
            return await _context.Classes.ToListAsync();
        }

        // ====================================
        // GET BY ID
        // ====================================

        [HttpGet("{id}")]
        public async Task<ActionResult<Classe>> GetClasse(int id)
        {
            var classe = await _context.Classes.FindAsync(id);

            if (classe == null)
            {
                return NotFound("Classe non trouvée");
            }

            return classe;
        }

        // ====================================
        // CREATE
        // ====================================

        [HttpPost]
        public async Task<ActionResult<Classe>> CreateClasse(Classe classe)
        {
            _context.Classes.Add(classe);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetClasse),
                new { id = classe.Id },
                classe
            );
        }

        // ====================================
        // UPDATE
        // ====================================

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClasse(int id, Classe classe)
        {
            if (id != classe.Id)
            {
                return BadRequest();
            }

            _context.Entry(classe).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Classes.Any(e => e.Id == id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // ====================================
        // DELETE
        // ====================================

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClasse(int id)
        {
            var classe = await _context.Classes.FindAsync(id);

            if (classe == null)
            {
                return NotFound();
            }

            _context.Classes.Remove(classe);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}