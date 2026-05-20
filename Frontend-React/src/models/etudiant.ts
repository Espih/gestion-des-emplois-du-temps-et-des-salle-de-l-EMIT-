import type { Classe } from "./classe";

export interface Etudiant {
  id_etudiant: number;
  matricule_stu: string;
  nom_stu: string;
  prenom_stu: string;
  email_stu: string;
  role_stu: "Etudiant" | "Delegue" | "President";
  id_cli: number; 
}

export interface EtudiantWithRelations extends Etudiant {
  classe?: Classe;
}