using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;
using GestionSallesEtEDT.Api.DTOs;
using BCrypt.Net;

namespace GestionSallesEtEDT.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UtilisateurController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UtilisateurController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Utilisateur
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UtilisateurResponseDto>>> GetUtilisateurs()
        {
            var users = await _context.Utilisateurs
                .Select(u => new UtilisateurResponseDto
                {
                    Id = u.Id,
                    Nom = u.Nom,
                    Prenom = u.Prenom,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/Utilisateur/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UtilisateurResponseDto>> GetUtilisateur(int id)
        {
            var u = await _context.Utilisateurs.FindAsync(id);
            if (u == null) return NotFound("Utilisateur non trouvé");

            var dto = new UtilisateurResponseDto
            {
                Id = u.Id,
                Nom = u.Nom,
                Prenom = u.Prenom,
                Email = u.Email,
                Role = u.Role
            };

            return Ok(dto);
        }

        // POST: api/Utilisateur/register
        [HttpPost("register")]
        public async Task<ActionResult<UtilisateurResponseDto>> Register(UtilisateurRegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Vérifier si l'email existe déjà
            if (await _context.Utilisateurs.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Cet email est déjà utilisé.");

            // Hachage du mot de passe avec BCrypt
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.MotDePasse);

            var utilisateur = new Utilisateur
            {
                Nom = dto.Nom,
                Prenom = dto.Prenom,
                Email = dto.Email,
                MotDePasseHash = passwordHash,
                Role = dto.Role
            };

            _context.Utilisateurs.Add(utilisateur);
            await _context.SaveChangesAsync();

            var response = new UtilisateurResponseDto
            {
                Id = utilisateur.Id,
                Nom = utilisateur.Nom,
                Prenom = utilisateur.Prenom,
                Email = utilisateur.Email,
                Role = utilisateur.Role
            };

            return CreatedAtAction(nameof(GetUtilisateur), new { id = utilisateur.Id }, response);
        }

        // POST: api/Utilisateur/login
        [HttpPost("login")]
        public async Task<ActionResult<UtilisateurResponseDto>> Login(UtilisateurLoginDto dto)
        {
            var utilisateur = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (utilisateur == null)
                return Unauthorized("Email ou mot de passe incorrect");

            // Vérification du mot de passe avec BCrypt
            bool passwordValid = BCrypt.Net.BCrypt.Verify(dto.MotDePasse, utilisateur.MotDePasseHash);

            if (!passwordValid)
                return Unauthorized("Email ou mot de passe incorrect");

            var response = new UtilisateurResponseDto
            {
                Id = utilisateur.Id,
                Nom = utilisateur.Nom,
                Prenom = utilisateur.Prenom,
                Email = utilisateur.Email,
                Role = utilisateur.Role
            };

            return Ok(response);
        }
    }
}