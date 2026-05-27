using System.ComponentModel.DataAnnotations;

namespace GestionSallesEtEDT.Api.Models
{
    public class Salle
    {
        [Key]
        public int id_salle { get; set; }

        [Required]
        public string code_salle { get; set; }

        [Required]
        public string type_salle { get; set; }
    }
}