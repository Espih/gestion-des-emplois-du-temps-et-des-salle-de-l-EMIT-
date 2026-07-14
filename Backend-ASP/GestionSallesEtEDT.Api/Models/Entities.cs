using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models
{
    [Table("utilisateurs")]
    public class Utilisateur
    {
        [Key, Column("id_utilisateur")]
        public int IdUtilisateur { get; set; }
        [Required, Column("email")]
        public string Email { get; set; } = string.Empty;
        [Required, Column("mot_de_passe")]
        public string MotDePasse { get; set; } = string.Empty;
        public string? ResetPasswordToken { get; set; }
        public DateTime? ResetPasswordTokenExpiry { get; set; }
    }

    [Table("mentions")]
    public class Mention
    {
        [Key, Column("id_mention")]
        public int IdMention { get; set; }
        [Required, Column("nom_mention")]
        public string NomMention { get; set; } = string.Empty;
    }

    [Table("parcours")]
    public class Parcours
    {
        [Key, Column("id_parcours")]
        public int IdParcours { get; set; }
        [Required, Column("nom_parcours")]
        public string NomParcours { get; set; } = string.Empty;
        [Column("id_mention")]
        public int IdMention { get; set; }
        [ForeignKey("IdMention")]
        public Mention? Mention { get; set; }
    }

    [Table("classes")]
    public class Classe
    {
        [Key, Column("id_classe")]
        public int IdClasse { get; set; }
        [Required, Column("niveau")]
        public string Niveau { get; set; } = string.Empty;
        [Column("id_parcours")]
        public int IdParcours { get; set; }
        [ForeignKey("IdParcours")]
        public Parcours? Parcours { get; set; }
    }

    [Table("salles")]
    public class Salle
    {
        [Key, Column("id_salle")]
        public int IdSalle { get; set; }
        [Required, Column("nom_salle")]
        public string NomSalle { get; set; } = string.Empty;
        [Column("capacite")]
        public int Capacite { get; set; }
    }

    [Table("enseignants")]
    public class Enseignant
    {
        [Key, Column("id_enseignant")]
        public int IdEnseignant { get; set; }
        [Required, Column("nom")]
        public string Nom { get; set; } = string.Empty;
        [Required, Column("civilite")]
        public string Civilite { get; set; } = "Meur";
    }

    [Table("matieres")]
    public class Matiere
    {
        [Key, Column("id_matiere")]
        public int IdMatiere { get; set; }
        [Required, Column("nom_matiere")]
        public string NomMatiere { get; set; } = string.Empty;
        [Column("couleur")]
        public string Couleur { get; set; } = "#e3f2fd";
    }

    [Table("seances")]
    public class Seance
    {
        [Key, Column("id_seance")]
        public int IdSeance { get; set; }
        [Required, Column("jour")]
        public string Jour { get; set; } = string.Empty;
        [Required, Column("heure_debut")]
        public string HeureDebut { get; set; } = string.Empty;
        [Required, Column("heure_fin")]
        public string HeureFin { get; set; } = string.Empty;

        [Column("id_salle")]
        public int IdSalle { get; set; }
        [ForeignKey("IdSalle")]
        public Salle? Salle { get; set; }

        [Column("id_enseignant")]
        public int IdEnseignant { get; set; }
        [ForeignKey("IdEnseignant")]
        public Enseignant? Enseignant { get; set; }

        [Column("id_matiere")]
        public int IdMatiere { get; set; }
        [ForeignKey("IdMatiere")]
        public Matiere? Matiere { get; set; }

        [Column("id_classe")]
        public int IdClasse { get; set; }
        [ForeignKey("IdClasse")]
        public Classe? Classe { get; set; }
    }

    [Table("refresh_tokens")]
    public class RefreshToken
    {
        [Key, Column("id")]
        public int Id { get; set; }

        [Required, Column("token")]
        public string Token { get; set; } = string.Empty;

        [Column("id_utilisateur")]
        public int IdUtilisateur { get; set; }

        [ForeignKey("IdUtilisateur")]
        public Utilisateur? Utilisateur { get; set; }

        [Column("expires_at")]
        public DateTime ExpiresAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("revoked_at")]
        public DateTime? RevokedAt { get; set; }

        [Column("replaced_by")]
        public string? ReplacedBy { get; set; }

        [Column("user_agent")]
        public string? UserAgent { get; set; }

        [Column("ip_address")]
        public string? IpAddress { get; set; }

        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
        public bool IsRevoked => RevokedAt != null;
        public bool IsActive => !IsRevoked && !IsExpired;
    }
}
