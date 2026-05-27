import type { Post } from "./post";
import type { Utilisateur } from "./utilisateur";

export interface Commentaire {
  id_commentaire: number;
  contenu_commentaire: string;
  date_commentaire: Date;
  id_post: number; 
  id_utilisateur: number; 
}

export interface CommentaireWithRelations extends Commentaire {
  post?: Post;
  utilisateur?: Utilisateur;
}