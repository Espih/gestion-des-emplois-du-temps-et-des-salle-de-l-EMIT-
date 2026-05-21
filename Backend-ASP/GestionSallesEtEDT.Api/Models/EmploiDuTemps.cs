using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models
{
    [Table("emplois_du_temps")]
    public class EmploiDuTemps
    {
        [Key]
        [Column("id_edt")]
        public int IdEdt { get; set; }

        [Column("libelle_edt")]
        [Required(ErrorMessage = "Le libellé est obligatoire")] // Ohatra: "EDT L2 Info - Semestre 1 2025-2026"
        [MaxLength(150)]
        public string Libelle { get; set; } = string.Empty;

        [Column("date_creation")]
        public DateOnly DateCreation { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);

        [Column("date_modification")]
        public DateOnly? DateModification { get; set; }

        [Column("statut")]
        [MaxLength(20)]
        public string Statut { get; set; } = "Brouillon"; // Brouillon, Validé, Publié

        // Clés étrangères
        [Column("id_classe")]
        [Required]
        public int IdClasse { get; set; }

        [Column("id_annee")]
        [Required]
        public int IdAnnee { get; set; }

        [Column("id_semestre")]
        [Required]
        public int IdSemestre { get; set; }

        // Navigation Properties
        public virtual Classe Classe { get; set; } = null!;
        public virtual AnneeUniversitaire AnneeUniversitaire { get; set; } = null!;
        public virtual Semestre Semestre { get; set; } = null!;

        public virtual ICollection<Seance> Seances { get; set; } = new List<Seance>();
    }
}