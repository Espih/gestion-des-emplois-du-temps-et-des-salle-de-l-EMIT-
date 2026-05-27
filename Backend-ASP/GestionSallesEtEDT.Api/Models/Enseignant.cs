using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models;

[Table("enseignants")]
public class Enseignant
{
    [Key]
    [Column("id_enseignant")]
    public int Id { get; set; }   // Doit correspondre à l'Id de Utilisateur

    [Required]
    [Column("nom_enseignant")]
    [MaxLength(100)]
    public string Nom { get; set; } = string.Empty;

    [Column("prenom_enseignant")]
    [MaxLength(100)]
    public string Prenom { get; set; } = string.Empty;

    [Column("email_ensei")]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Column("telephone_ensei")]
    [MaxLength(20)]
    public string Telephone { get; set; } = string.Empty;

    // Relations
    public virtual ICollection<Seance> Seances { get; set; } = new List<Seance>();

    public virtual Utilisateur? Utilisateur { get; set; }
}

