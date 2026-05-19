import type { Commentaire } from "./commentaire";
import type { Utilisateur } from "./utilisateur";

export interface Post {
  id_post: number;
  titre_post: string;
  contenu_post: string;
  date_post: Date;
  id_utilisateur: number; 
}

export interface PostWithRelations extends Post {
  utilisateur?: Utilisateur;
  commentaires?: Commentaire[];
}