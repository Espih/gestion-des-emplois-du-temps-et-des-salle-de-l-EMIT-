using System.ComponentModel.DataAnnotations;

namespace GestionSallesEtEDT.Api.DTOs
{
    public class EmploiDuTempsDto
    {
        public int IdEdt { get; set; }

        public string Libelle { get; set; } = string.Empty;
        public DateOnly DateCreation { get; set; }
        public DateOnly? DateModification { get; set; }
        public string Statut { get; set; } = string.Empty;

        public int IdClasse { get; set; }
        public int IdAnnee { get; set; }
        public int IdSemestre { get; set; }

        // Données enrichies pour l'affichage
        public string? ClasseNom { get; set; }
        public string? NiveauClasse { get; set; }
        public string? AnneeLibelle { get; set; }
        public string? SemestreNom { get; set; }
    }

    public class EmploiDuTempsCreateDto
    {
        [Required(ErrorMessage = "Le libellé est obligatoire")]
        [MaxLength(150)]
        public string Libelle { get; set; } = string.Empty;

        [Required(ErrorMessage = "La classe est obligatoire")]
        public int IdClasse { get; set; }

        [Required(ErrorMessage = "L'année universitaire est obligatoire")]
        public int IdAnnee { get; set; }

        [Required(ErrorMessage = "Le semestre est obligatoire")]
        public int IdSemestre { get; set; }

        public string Statut { get; set; } = "Brouillon";
    }

    public class EmploiDuTempsUpdateDto
    {
        [Required]
        [MaxLength(150)]
        public string Libelle { get; set; } = string.Empty;

        public string Statut { get; set; } = "Brouillon";
    }
}