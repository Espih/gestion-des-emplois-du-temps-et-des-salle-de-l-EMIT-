using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models
{
    [Table("seances")]
    public class Seance
    {
        // =========================
        // CLE PRIMAIRE
        // =========================

        [Key]
        [Column("id_seance")]
        public int id_seance { get; set; }

        // =========================
        // INFORMATIONS SEANCE
        // =========================

        [Required]
        [Column("jour")]
        public string jour { get; set; } = string.Empty;

        [Required]
        [Column("heure_debut")]
        public TimeSpan heure_debut { get; set; }

        [Required]
        [Column("heure_fin")]
        public TimeSpan heure_fin { get; set; }

        // =========================
        // CLES ETRANGERES
        // =========================

        [Column("id_salle")]
        public int id_salle { get; set; }

        [ForeignKey("id_salle")]
        public Salle? Salle { get; set; }

        [Column("id_matiere")]
        public int id_matiere { get; set; }

        [ForeignKey("id_matiere")]
        public Matiere? Matiere { get; set; }

        [Column("id_enseignant")]
        public int id_enseignant { get; set; }

        [ForeignKey("id_enseignant")]
        public Enseignant? Enseignant { get; set; }

        [Column("id_cla")]
        public int id_cla { get; set; }

        [ForeignKey("id_cla")]
        public Classe? Classe { get; set; }

        [Column("id_semestre")]
        public int id_semestre { get; set; }

        [ForeignKey("id_semestre")]
        public Semestre? Semestre { get; set; }
    }
}