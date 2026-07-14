using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<Mention> Mentions { get; set; }
        public DbSet<Parcours> Parcours { get; set; }
        public DbSet<Classe> Classes { get; set; }
        public DbSet<Salle> Salles { get; set; }
        public DbSet<Enseignant> Enseignants { get; set; }
        public DbSet<Matiere> Matieres { get; set; }
        public DbSet<Seance> Seances { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}