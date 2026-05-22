import type { AnneeUniversitaire } from "./anneeUniversitaire";
import type { Classe } from "./classe";
import type { Seance } from "./seance";

export interface EmploiDuTemps {
  id_temps: number;
  dateCreation_temps: Date;
  id_cli: number; 
  id_annee: number; 
}

export interface EmploiDuTempsWithRelations extends EmploiDuTemps {
  classe?: Classe;
  anneeUniversitaire?: AnneeUniversitaire;
  seances?: Seance[];
}