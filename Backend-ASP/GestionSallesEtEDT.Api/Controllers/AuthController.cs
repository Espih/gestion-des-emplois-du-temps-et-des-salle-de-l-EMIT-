using Microsoft.AspNetCore.Mvc;
using GestionSallesEtEDT.Api.Services;
using GestionSallesEtEDT.Api.Data; 

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
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            // Simulation : Remplace par une vraie vérification en DB avec BCrypt pour le mot de passe
            var user = _context.Utilisateurs.FirstOrDefault(u => u.Email == loginDto.Email);

            if (user == null || user.MotDePasseHash != loginDto.Password) 
                return Unauthorized("Email ou mot de passe incorrect");

            var token = _authService.GenerateToken(user);
            return Ok(new { token });
        }
    }

    public class LoginDto { public required string Email { get; set; } public required string Password { get; set; } }
}