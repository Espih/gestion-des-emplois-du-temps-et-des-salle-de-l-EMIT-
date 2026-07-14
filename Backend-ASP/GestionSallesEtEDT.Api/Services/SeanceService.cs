using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Data;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Services
{
    public interface ISeanceService
    {
        Task<bool> DetecterConflitAsync(Seance seance);
    }

    public class SeanceService : ISeanceService
    {
        private readonly ApplicationDbContext _context;
        
        public SeanceService(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Parse tolerant qui accepte "08:00", "8h00", "8:00", "14h30-15h45" etc.
        /// </summary>
        private static TimeSpan ParseHeure(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return TimeSpan.Zero;

            var s = input.Trim().ToLower()
                .Replace("h", ":")
                .Replace("-", "–"); // normaliser le tiret

            // Cas "08:00" ou "8:00"
            if (TimeSpan.TryParse(s, out var ts))
                return ts;

            // Fallback — essayer de parser manuellement si ça a échoué
            try
            {
                var parts = s.Split(':');
                if (parts.Length >= 2)
                {
                    var heures = int.Parse(parts[0]);
                    var minutes = int.Parse(parts[1]);
                    return new TimeSpan(heures, minutes, 0);
                }
            }
            catch { }

            return TimeSpan.Zero;
        }

        public async Task<bool> DetecterConflitAsync(Seance s)
        {
            var debut = ParseHeure(s.HeureDebut);
            var fin = ParseHeure(s.HeureFin);

            // Si même pas des heures valides, on laisse passer pour que l'autre validation gère
            if (debut == fin || fin <= debut)
                return false;

            var seancesDuJour = await _context.Seances
                .Where(x => x.Jour == s.Jour && x.IdSeance != s.IdSeance)
                .ToListAsync();

            foreach (var existing in seancesDuJour)
            {
                var exDebut = ParseHeure(existing.HeureDebut);
                var exFin = ParseHeure(existing.HeureFin);

                // Vérification du chevauchement d'horaires
                if (debut < exFin && fin > exDebut)
                {
                    if (existing.IdSalle == s.IdSalle ||
                        existing.IdEnseignant == s.IdEnseignant ||
                        existing.IdClasse == s.IdClasse)
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}