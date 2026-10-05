using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;
using GestionSallesEtEDT.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace GestionSallesEtEDT.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthController> _logger;
        private readonly PasswordHasher<Utilisateur> _passwordHasher;

        public AuthController(
            ApplicationDbContext context,
            IConfiguration config,
            IEmailService emailService,
            ILogger<AuthController> logger)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
            _logger = logger;
            _passwordHasher = new PasswordHasher<Utilisateur>();
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Token invalide." });

            var user = await _context.Utilisateurs
                .Where(u => u.IdUtilisateur == userId)
                .Select(u => new
                {
                    u.IdUtilisateur,
                    u.Email
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "Utilisateur introuvable." });

            return Ok(user);
        }

        // ─── LOGIN ───────────────────────────────────────────
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var normalizedEmail = request.Email.Trim().ToLower();
            var u = await _context.Utilisateurs
                .FirstOrDefaultAsync(x => x.Email.ToLower() == normalizedEmail);

            string hashedPasswordToVerify = u?.MotDePasse
                ?? _passwordHasher.HashPassword(null!, "DummyPasswordForSecurity");

            var verificationResult = _passwordHasher
                .VerifyHashedPassword(u!, hashedPasswordToVerify, request.MotDePasse);

            if (u == null || verificationResult == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Identifiants ou mot de passe incorrects." });

            // Génération du couple
            var accessToken = GenerateAccessToken(u);
            var refreshToken = await GenerateAndStoreRefreshTokenAsync(u.IdUtilisateur);

            return Ok(new
            {
                accessToken,
                refreshToken,
                email = u.Email,
                expiresIn = GetAccessTokenExpirationSeconds()
            });
        }

        // ─── CHECK EMAIL ─────────────────────────────────────
        [HttpPost("check-email")]
        public async Task<IActionResult> CheckEmail([FromBody] CheckEmailRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { exists = false });

            var normalizedEmail = request.Email.Trim().ToLower();
            var exists = await _context.Utilisateurs
                .AnyAsync(x => x.Email.ToLower() == normalizedEmail);

            return Ok(new { exists });
        }

        // ─── MOT DE PASSE OUBLIÉ ────────────────────────────
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            // Message générique pour ne jamais révéler si l'email existe
            var successResponse = new
            {
                message = "Si cette adresse existe, un email de réinitialisation a été envoyé."
            };

            if (string.IsNullOrWhiteSpace(request.Email))
                return Ok(successResponse);

            var normalizedEmail = request.Email.Trim().ToLower();
            var user = await _context.Utilisateurs
                .FirstOrDefaultAsync(x => x.Email.ToLower() == normalizedEmail);

            if (user == null)
            {
                // Délai artificiel anti-timing attack
                await Task.Delay(Random.Shared.Next(200, 500));
                return Ok(successResponse);
            }

            // Générer un token cryptographiquement sécurisé
            var resetToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
            user.ResetPasswordToken = resetToken;
            user.ResetPasswordTokenExpiry = DateTime.UtcNow.AddMinutes(30);

            await _context.SaveChangesAsync();

            // Construire le lien
            var frontendUrl = _config["App:FrontendUrl"] ?? "http://localhost:5173";
            var resetLink = $"{frontendUrl}/reset-password?token={resetToken}&email={Uri.EscapeDataString(normalizedEmail)}";

            // Email HTML
            var htmlBody = $@"
            <!DOCTYPE html>
            <html>
            <body style='margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f1f5f9;'>
                <div style='max-width: 500px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);'>
                    
                    <div style='background-color: #1a3c6e; padding: 24px 32px; text-align: center;'>
                        <h1 style='color: white; margin: 0; font-size: 20px;'>EMIT — Gestion Académique</h1>
                    </div>
                    
                    <div style='padding: 32px;'>
                        <h2 style='color: #1a3c6e; margin-top: 0;'>Réinitialisation du mot de passe</h2>
                        
                        <p style='color: #475569; line-height: 1.6;'>
                            Bonjour,<br><br>
                            Vous avez demandé la réinitialisation de votre mot de passe.
                            Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.
                        </p>
                        
                        <div style='text-align: center; margin: 28px 0;'>
                            <a href='{resetLink}' 
                               style='display: inline-block; padding: 14px 32px; background-color: #1a3c6e; 
                                      color: white; text-decoration: none; border-radius: 8px; 
                                      font-weight: bold; font-size: 14px;'>
                                Réinitialiser mon mot de passe
                            </a>
                        </div>
                        
                        <p style='color: #94a3b8; font-size: 13px; line-height: 1.6;'>
                            Ce lien expire dans <strong>30 minutes</strong>.<br>
                            Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
                        </p>
                        
                        <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;'>
                        
                        <p style='color: #94a3b8; font-size: 12px;'>
                            Si le bouton ne fonctionne pas, copiez ce lien :<br>
                            <a href='{resetLink}' style='color: #1a3c6e; word-break: break-all;'>{resetLink}</a>
                        </p>
                    </div>
                    
                    <div style='background-color: #f8fafc; padding: 16px 32px; text-align: center;'>
                        <p style='color: #94a3b8; font-size: 11px; margin: 0;'>
                            © 2026 EMIT — École de Management et d'Innovation Technologique
                        </p>
                    </div>
                </div>
            </body>
            </html>";

            try
            {
                await _emailService.SendEmailAsync(
                    user.Email,
                    "Réinitialisation de mot de passe — EMIT",
                    htmlBody
                );
                _logger.LogInformation("Email de reset envoyé à {Email}", user.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Échec envoi email de reset à {Email}", user.Email);
            }

            return Ok(successResponse);
        }

        // ─── RÉINITIALISER LE MOT DE PASSE ──────────────────
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Token) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.NouveauMotDePasse))
            {
                return BadRequest(new { message = "Tous les champs sont requis." });
            }

            if (request.NouveauMotDePasse.Length < 8)
                return BadRequest(new { message = "Le mot de passe doit contenir au moins 8 caractères." });

            var normalizedEmail = request.Email.Trim().ToLower();
            var user = await _context.Utilisateurs
                .FirstOrDefaultAsync(x => x.Email.ToLower() == normalizedEmail);

            if (user == null ||
                user.ResetPasswordToken != request.Token ||
                user.ResetPasswordTokenExpiry == null ||
                user.ResetPasswordTokenExpiry < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Le lien est invalide ou a expiré." });
            }

            user.MotDePasse = _passwordHasher.HashPassword(user, request.NouveauMotDePasse);
            user.ResetPasswordToken = null;
            user.ResetPasswordTokenExpiry = null;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Mot de passe réinitialisé pour {Email}", user.Email);

            return Ok(new { message = "Mot de passe réinitialisé avec succès." });
        }

        // ─── REGISTER TEST USER ─────────────────────────────
        /*[HttpPost("register-test-user")]
        public async Task<IActionResult> RegisterTestUser()
        {
            var userExists = await _context.Utilisateurs
                .AnyAsync(u => u.Email.ToLower() == "german2004rak@gmail.com");
            if (userExists) return BadRequest("L'utilisateur existe déjà.");

            var testUser = new Utilisateur
            {
                Email = "german2004rak@gmail.com",
                MotDePasse = _passwordHasher.HashPassword(null!, "Azerty12345!")
            };
            _context.Utilisateurs.Add(testUser);
            await _context.SaveChangesAsync();

            return Ok("Utilisateur créé ! → german2004rak@gmail.com / Azerty12345!");
        }*/

        // ─── REFRESH TOKEN ─────────────────────────────
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
                return BadRequest(new { message = "Refresh token requis." });

            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.Utilisateur)
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (storedToken == null)
            {
                _logger.LogWarning("Tentative refresh avec token inexistant.");
                return Unauthorized(new { message = "Refresh token invalide." });
            }

            if (!storedToken.IsActive)
            {
                if (storedToken.IsRevoked)
                {
                    _logger.LogWarning(
                        "Reuse d'un refresh token révoqué détecté pour user {UserId}. Révocation totale.",
                        storedToken.IdUtilisateur);

                    await RevokeAllUserTokensAsync(storedToken.IdUtilisateur);
                }
                return Unauthorized(new { message = "Refresh token expiré ou révoqué." });
            }

            if (storedToken.Utilisateur == null)
                return Unauthorized(new { message = "Utilisateur introuvable." });

            var newRefreshToken = await GenerateAndStoreRefreshTokenAsync(storedToken.IdUtilisateur);

            storedToken.RevokedAt = DateTime.UtcNow;
            storedToken.ReplacedBy = newRefreshToken;
            await _context.SaveChangesAsync();

            var newAccessToken = GenerateAccessToken(storedToken.Utilisateur);

            return Ok(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken,
                email = storedToken.Utilisateur.Email,
                expiresIn = GetAccessTokenExpirationSeconds()
            });
        }

        // ─── LOGOUT ─────────
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                var storedToken = await _context.RefreshTokens
                    .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

                if (storedToken != null && storedToken.IsActive)
                {
                    storedToken.RevokedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new { message = "Déconnexion réussie." });
        }

        // ─── HELPERS ────────────────────────────────────
        private int GetAccessTokenExpirationSeconds()
        {
            var minutes = int.Parse(_config["Jwt:AccessTokenExpirationMinutes"] ?? "15");
            return minutes * 60;
        }

        private string GenerateAccessToken(Utilisateur user)
        {
            var keyStr = _config["Jwt:Key"];

                if (string.IsNullOrWhiteSpace(keyStr) || keyStr.Length < 32)
                    throw new InvalidOperationException(
                        "Jwt:Key doit être configurée et contenir au moins 32 caractères.");

            var minutes = int.Parse(_config["Jwt:AccessTokenExpirationMinutes"] ?? "15");
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(keyStr);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.IdUtilisateur.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddMinutes(minutes),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private async Task<string> GenerateAndStoreRefreshTokenAsync(int userId)
        {
            var tokenValue = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            var days = int.Parse(_config["Jwt:RefreshTokenExpirationDays"] ?? "7");

            var refreshToken = new RefreshToken
            {
                Token = tokenValue,
                IdUtilisateur = userId,
                ExpiresAt = DateTime.UtcNow.AddDays(days),
                CreatedAt = DateTime.UtcNow,
                UserAgent = Request.Headers["User-Agent"].ToString(),
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
            };

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return tokenValue;
        }

        private async Task RevokeAllUserTokensAsync(int userId)
        {
            var tokens = await _context.RefreshTokens
                .Where(rt => rt.IdUtilisateur == userId && rt.RevokedAt == null)
                .ToListAsync();

            foreach (var t in tokens)
                t.RevokedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }

    // ─── DTOs ────────────────────────────────────────────────
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string NouveauMotDePasse { get; set; } = string.Empty;
    }

    public class CheckEmailRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class LogoutRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}