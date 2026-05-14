using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models;

[Table("classes")]
public class Classe {
    [Key] [Column("id_cla")] 
    public int Id { get; set; }
    [Required] [Column("nom_cla")] 
    public string Nom { get; set; } = string.Empty;
    [Column("niveau_cla")] 
    public string Niveau { get; set; } = string.Empty;
    public virtual ICollection<Etudiant> Etudiants { get; set; } = new List<Etudiant>();
}