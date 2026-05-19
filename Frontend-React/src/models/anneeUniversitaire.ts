import type { Classe } from "./classe";
import type { EmploiDuTemps } from "./emploiDuTemps";

export interface AnneeUniversitaire {
  id_annee: number;
  dateDebut_annee: Date;
  dateFin_annee: Date;
}

export interface AnneeUniversitaireWithRelations extends AnneeUniversitaire {
  classes?: Classe[];
  emploisDuTemps?: EmploiDuTemps[];
}