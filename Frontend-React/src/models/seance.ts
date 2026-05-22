import type { Classe } from "./classe";
import type { Matiere } from "./matiere";
import type { Salle } from "./salle";

export interface Seance {
  id_seance: number;
  id_jour_seance: "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi";
  heureDebut_seance: string;
  heureFin_seance: string;
  id_matiere: number;
  id_salle: number; 
  id_cli: number; 
}

export interface SeanceWithRelations extends Seance {
  matiere?: Matiere;
  salle?: Salle;
  classe?: Classe;
}