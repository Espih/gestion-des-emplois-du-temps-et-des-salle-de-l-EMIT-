using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Services
{
    public interface IAuthService
    {
        string GenerateToken(Utilisateur utilisateur);
    }
}