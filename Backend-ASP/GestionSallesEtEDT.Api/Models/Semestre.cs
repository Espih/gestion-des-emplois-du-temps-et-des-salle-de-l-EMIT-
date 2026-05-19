using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models
{
    [Table("semestres")]
    public class Semestre
    {
        [Key]
        [Column("id_semestre")]
        public int Id { get; set; }

        [Required]
        [Column("nom_semestre")]
        public string Nom { get; set; } = string.Empty;
    }
}