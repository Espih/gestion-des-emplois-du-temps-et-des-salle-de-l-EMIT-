using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models;

[Table("enseignants")]
public class Enseignant {
    [Key, ForeignKey("Utilisateur")]
    [Column("id_ensei")]
    public int Id { get; set; }
    
    [Column("telephone_ensei")]
    public string? Telephone { get; set; }

    public virtual Utilisateur Utilisateur { get; set; } = null!;
    public virtual ICollection<Seance> Seances { get; set; } = new List<Seance>();
}