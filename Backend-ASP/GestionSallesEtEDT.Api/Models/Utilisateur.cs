using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models;

[Table("utilisateurs")]
public class Utilisateur {
    [Key]
    [Column("id_utilisateur")]
    public int Id { get; set; }

    [Required, MaxLength(100)]
    [Column("nom_uti")]
    public string Nom { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    [Column("prenom_uti")]
    public string Prenom { get; set; } = string.Empty;

    [Required, EmailAddress]
    [Column("email_uti")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Column("mdp_uti")]
    public string MotDePasseHash { get; set; } = string.Empty;

    [Required]
    [Column("role_uti")]
    public string Role { get; set; } = "Etudiant";

    public virtual Enseignant? Enseignant { get; set; }
    public virtual Etudiant? Etudiant { get; set; }
}