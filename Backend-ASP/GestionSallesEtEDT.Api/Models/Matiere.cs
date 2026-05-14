using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models;

[Table("matieres")]
public class Matiere {
    [Key] [Column("id_matiere")] 
    public int Id { get; set; }
    [Required] [Column("code_matiere")] 
    public string Code { get; set; } = string.Empty;
    [Column("libelle_matiere")] 
    public string Libelle { get; set; } = string.Empty;
    [Column("coefficient_matiere")] 
    public double Coefficient { get; set; }
}