
import type { AnneeUniversitaire } from "../models/anneeUniversitaire";
import type { Classe } from "../models/classe";
import api from "./api";

export const anneeUniversitaireService = {
  // Récupérer toutes les années universitaires
  getAll: async (): Promise<AnneeUniversitaire[]> => {
    const response = await api.get("/anneeUniversitaire");
    return response.data;
  },

  // Récupérer une année universitaire par ID
  getById: async (id: number): Promise<AnneeUniversitaire> => {
    const response = await api.get(`/anneeUniversitaire/${id}`);
    return response.data;
  },

  // Créer une nouvelle année universitaire
  create: async (annee: Omit<AnneeUniversitaire, "id_annee">): Promise<AnneeUniversitaire> => {
    const response = await api.post("/anneeUniversitaire", annee);
    return response.data;
  },

  // Mettre à jour une année universitaire
  update: async (id: number, annee: Partial<AnneeUniversitaire>): Promise<AnneeUniversitaire> => {
    const response = await api.patch(`/anneeUniversitaire/${id}`, annee);
    return response.data;
  },

  // Supprimer une année universitaire
  delete: async (id: number): Promise<void> => {
    await api.delete(`/anneeUniversitaire/${id}`);
  },

  // Récupérer l'année universitaire en cours
  getCurrentYear: async (): Promise<AnneeUniversitaire | null> => {
    const response = await api.get("/anneeUniversitaire");
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    
    const anneeEnCours = response.data.find((annee: AnneeUniversitaire) => {
      const debut = new Date(annee.dateDebut_annee);
      const fin = new Date(annee.dateFin_annee);
      return currentDate >= debut && currentDate <= fin;
    });
    
    return anneeEnCours || null;
  },

  // Récupérer les classes d'une année universitaire
  getClasses: async (id_annee: number): Promise<Classe[]> => {
    const response = await api.get(`/classes?id_annee=${id_annee}`);
    return response.data;
  },
};