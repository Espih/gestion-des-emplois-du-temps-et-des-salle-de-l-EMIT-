using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models;

[Table("salles")] 
public class Salle
{
    [Key]
    [Column("id_salle")]
    public int Id { get; set; }

    [Required]
    [Column("code_salle")]
    public string Code { get; set; } = string.Empty;

    [Required]
    [Column("type_salle")]
    public string Type { get; set; } = string.Empty;
}