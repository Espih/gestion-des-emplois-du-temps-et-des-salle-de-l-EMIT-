import type { Enseignant } from "./enseignant";
import type { Seance } from "./seance";
export interface Matiere {
  id_matiere: number;
  code_matiere: string;
  libelle_matiere: string;
  coefficient_matiere: number;
  id: number; 
}

export interface MatiereWithRelations extends Matiere {
  enseignant?: Enseignant;
  seances?: Seance[];
}