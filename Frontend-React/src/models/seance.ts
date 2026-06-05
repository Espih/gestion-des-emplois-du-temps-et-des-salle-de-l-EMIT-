export interface Seance {
  id_seance?: number;

  jour:
    | "Lundi"
    | "Mardi"
    | "Mercredi"
    | "Jeudi"
    | "Vendredi"
    | "Samedi";

  heure_debut: string;
  heure_fin: string;

  id_cla: number;
  id_matiere: number;
  id_salle: number;
  id_enseignant: number;
  id_semestre?: number;
}