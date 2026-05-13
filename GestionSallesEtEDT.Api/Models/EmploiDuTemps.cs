using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models;

[Table("emplois_du_temps")]
public class EmploiDuTemps {
    [Key] [Column("id_edt")] 
    public int Id { get; set; }
    [Column("dateCreation_edt")] 
    public DateTime DateCreation { get; set; } = DateTime.UtcNow;

    [Column("id_utilisateur")] 
    public int UtilisateurId { get; set; }
    [Column("id_cla")] 
    public int ClasseId { get; set; }
    
    public virtual ICollection<Seance> Seances { get; set; } = new List<Seance>();
}