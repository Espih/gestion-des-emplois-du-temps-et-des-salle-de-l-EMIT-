using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models
{
    [Table("annees_universitaires")]
    public class AnneeUniversitaire
    {
        [Key]
        [Column("id_annee")]
        public int Id { get; set; }

        [Required]
        [Column("libelle_annee")]
        public string Libelle { get; set; } = string.Empty;

        [Column("date_debut")]
        public DateOnly DateDebut { get; set; }

        [Column("date_fin")]
        public DateOnly DateFin { get; set; }
    }
}