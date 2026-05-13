using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Data;

public class ApplicationDbContext : DbContext {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Utilisateur> Utilisateurs { get; set; }
    public DbSet<Enseignant> Enseignants { get; set; }
    public DbSet<Etudiant> Etudiants { get; set; }
    public DbSet<Classe> Classes { get; set; }
    public DbSet<Salle> Salles { get; set; }
    public DbSet<Matiere> Matieres { get; set; }
    public DbSet<EmploiDuTemps> EmploisDuTemps { get; set; }
    public DbSet<Seance> Seances { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        // Configuration Héritage Utilisateur -> Enseignant (1:1)
        modelBuilder.Entity<Enseignant>()
            .HasOne(e => e.Utilisateur)
            .WithOne(u => u.Enseignant)
            .HasForeignKey<Enseignant>(e => e.Id);

        // Configuration Héritage Utilisateur -> Etudiant (1:1)
        modelBuilder.Entity<Etudiant>()
            .HasOne(e => e.Utilisateur)
            .WithOne(u => u.Etudiant)
            .HasForeignKey<Etudiant>(e => e.Id);
            
        base.OnModelCreating(modelBuilder);
    }
}