using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionSallesEtEDT.Api.Models;

[Table("seances")]
public class Seance {
    [Key] [Column("id_seance")] 
    public int Id { get; set; }
    [Required] [Column("jour_seance")] 
    public string Jour { get; set; } = string.Empty;
    [Required] [Column("heureDebut_seance")] 
    public TimeSpan HeureDebut { get; set; }
    [Required] [Column("heureFin_seance")] 
    public TimeSpan HeureFin { get; set; }

    public int IdEdt { get; set; }
    public int IdSalle { get; set; }
    public int IdEnsei { get; set; }
    public int IdMatiere { get; set; }

    [ForeignKey("IdEdt")] 
    public virtual EmploiDuTemps EmploiDuTemps { get; set; } = null!;
    [ForeignKey("IdSalle")] 
    public virtual Salle Salle { get; set; } = null!;
    [ForeignKey("IdEnsei")] 
    public virtual Enseignant Enseignant { get; set; } = null!;
    [ForeignKey("IdMatiere")] 
    public virtual Matiere Matiere { get; set; } = null!;
}