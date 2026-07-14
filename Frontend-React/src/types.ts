export interface Utilisateur {
  idUtilisateur: number;
  email: string;
}

export interface Mention {
  idMention: number;
  nomMention: string;
}

export interface Parcours {
  idParcours: number;
  nomParcours: string;
  idMention: number;
  mention?: Mention;
}

export interface Classe {
  idClasse: number;
  niveau: string;
  idParcours: number;
  parcours?: Parcours;
}

export interface Salle {
  idSalle: number;
  nomSalle: string;
  capacite: number;
}

export interface Enseignant {
  idEnseignant: number;
  nom: string;
  civilite: string;
}

export interface Matiere {
  idMatiere: number;
  nomMatiere: string;
  couleur: string;
}

export interface Seance {
  idSeance: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  idSalle: number;
  salle?: Salle;
  idEnseignant: number;
  enseignant?: Enseignant;
  idMatiere: number;
  matiere?: Matiere;
  idClasse: number;
  classe?: Classe;
}

export interface Metadata {
  mentions: Mention[];
  parcours: Parcours[];
  classes: Classe[];
  enseignants: Enseignant[];
  matieres: Matiere[];
  salles: Salle[];
}

export interface SalleOccupation {
  idSeance: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  enseignant: string;
  classe: string;
  parcours: string;
  mention: string;
}

export interface SalleOccupationResponse {
  salle: Salle;
  occupations: SalleOccupation[];
}
