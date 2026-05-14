using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models;

[Table("etudiants")]
public class Etudiant {
    [Key, ForeignKey("Utilisateur")]
    [Column("id_etudiant")]
    public int Id { get; set; }

    [Required]
    [Column("matricule_etu")]
    public string Matricule { get; set; } = string.Empty;

    [Column("id_cla")]
    public int ClasseId { get; set; }
    public virtual Classe Classe { get; set; } = null!;
    public virtual Utilisateur Utilisateur { get; set; } = null!;
}