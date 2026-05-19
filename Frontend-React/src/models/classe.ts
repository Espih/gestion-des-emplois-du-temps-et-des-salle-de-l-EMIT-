import type { AnneeUniversitaire } from "./anneeUniversitaire";
import type { EmploiDuTemps } from "./emploiDuTemps";
import type { Etudiant } from "./etudiant";
import type { Seance } from "./seance";

export interface Classe {
  id_cli: number;
  nom_cli: string;
  niveau_cli: string;
  id_annee: number; 
}

export interface ClasseWithRelations extends Classe {
  etudiants?: Etudiant[];
  seances?: Seance[];
  emploiDuTemps?: EmploiDuTemps;
  anneeUniversitaire?: AnneeUniversitaire;
}