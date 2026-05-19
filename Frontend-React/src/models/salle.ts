import type { Seance } from "./seance";

export interface Salle {
  id_salle: number;
  code_salle: string;
  type_salle: "Cours" | "TP" | "Amphi" | "Laboratoire" | "Examen";
}

export interface SalleWithRelations extends Salle {
  seances?: Seance[];
}