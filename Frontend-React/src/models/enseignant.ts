import type { Matiere } from "./matiere";

export interface Enseignant {
  // id_enseignant: number;
  id:number;
  nom_enseignant: string;
  prenom_enseignant: string;
  email_enseignant: string;
  telephone_enseignant: string;
}

export interface EnseignantWithRelations extends Enseignant {
  matieres?: Matiere[];
}