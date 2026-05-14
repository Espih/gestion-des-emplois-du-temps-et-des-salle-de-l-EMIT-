using Microsoft.AspNetCore.Mvc;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace GestionSallesEtEDT.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;

        public AuthController(IAuthService authService, ApplicationDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Recherche de l'utilisateur
            var user = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            // Vérification des identifiants (mot de passe en clair pour le test actuel)
            if (user == null || user.MotDePasseHash != request.Password)
            {
                return Unauthorized(new { message = "Email ou mot de passe incorrect." });
            }

            // Génération du Token
            var token = _authService.GenerateToken(user);

            // On renvoie le token et les infos utiles pour le frontend
            return Ok(new 
            { 
                token = token,
                user = new { 
                    nom = user.Nom, 
                    email = user.Email, 
                    role = user.Role.ToString() 
                }
            });
        }
    }

    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}