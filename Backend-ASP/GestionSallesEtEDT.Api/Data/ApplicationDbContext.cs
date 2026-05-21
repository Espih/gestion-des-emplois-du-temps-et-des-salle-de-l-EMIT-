using Microsoft.EntityFrameworkCore;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Utilisateur> Utilisateurs { get; set; }
    public DbSet<Enseignant> Enseignants { get; set; }
    public DbSet<Etudiant> Etudiants { get; set; }
    public DbSet<Classe> Classes { get; set; }
    public DbSet<Salle> Salles { get; set; }
    public DbSet<Matiere> Matieres { get; set; }
    public DbSet<EmploiDuTemps> EmploisDuTemps { get; set; }
    public DbSet<Seance> Seances { get; set; }
    public DbSet<Semestre> Semestres { get; set; }
    public DbSet<AnneeUniversitaire> AnneesUniversitaires { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Config Héritage Utilisateur -> Enseignant (1:1)
        modelBuilder.Entity<Enseignant>()
            .HasOne(e => e.Utilisateur)
            .WithOne(u => u.Enseignant)
            .HasForeignKey<Enseignant>(e => e.Id);

        // Configuration Héritage Utilisateur -> Etudiant (1:1)
        modelBuilder.Entity<Etudiant>()
            .HasOne(e => e.Utilisateur)
            .WithOne(u => u.Etudiant)
            .HasForeignKey<Etudiant>(e => e.Id);

        // ==================== Configuration EmploiDuTemps ====================
        modelBuilder.Entity<EmploiDuTemps>(entity =>
        {
            entity.ToTable("emplois_du_temps");

            // Relation avec Classe
            entity.HasOne(e => e.Classe)
                  .WithMany()                    // Tu peux mettre .WithMany(c => c.EmploisDuTemps) plus tard
                  .HasForeignKey(e => e.IdClasse)
                  .OnDelete(DeleteBehavior.Restrict);

            // Relation avec AnneeUniversitaire
            entity.HasOne(e => e.AnneeUniversitaire)
                  .WithMany()
                  .HasForeignKey(e => e.IdAnnee)
                  .OnDelete(DeleteBehavior.Restrict);

            // Relation avec Semestre
            entity.HasOne(e => e.Semestre)
                  .WithMany()
                  .HasForeignKey(e => e.IdSemestre)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        base.OnModelCreating(modelBuilder);
    }
}