import type { Commentaire } from "./commentaire";
import type { Post } from "./post";

export interface Utilisateur {
  id_utilisateur: number;
  nom_utilisateur: string;
  prenom_utilisateur: string;
  email_utilisateur: string;
  role_utilisateur: "Admin" | "Professeur" | "Etudiant" | "Secretaire";
  password?: string; 
}

export interface UtilisateurWithRelations extends Utilisateur {
  posts?: Post[];
  commentaires?: Commentaire[];
}