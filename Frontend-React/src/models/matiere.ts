import type { Enseignant } from "./enseignant";
import type { Seance } from "./seance";
export interface Matiere {
  id: number;
  code_matiere: string;
  libelle_matiere: string;
  coefficient_matiere: number;
  id_enseignant: number; 
}

export interface MatiereWithRelations extends Matiere {
  enseignant?: Enseignant;
  seances?: Seance[];
}