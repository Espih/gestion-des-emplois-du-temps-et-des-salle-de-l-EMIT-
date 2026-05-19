import type { Classe } from "../models/classe";
import type { EmploiDuTemps } from "../models/emploiDuTemps";
import type { Etudiant } from "../models/etudiant";
import api from "./api";


export const classeService = {
  getAll: async (): Promise<Classe[]> => {
    const response = await api.get("/classes");
    return response.data;
  },

  getById: async (id: number): Promise<Classe> => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  create: async (classe: Omit<Classe, "id_cli">): Promise<Classe> => {
    const response = await api.post("/classes", classe);
    return response.data;
  },

  update: async (id: number, classe: Partial<Classe>): Promise<Classe> => {
    const response = await api.patch(`/classes/${id}`, classe);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/classes/${id}`);
  },

  // Récupérer les étudiants d'une classe
  getEtudiants: async (id_cli: number): Promise<Etudiant[]> => {
    const response = await api.get(`/classes/${id_cli}/etudiants`);
    return response.data;
  },

  // Récupérer l'emploi du temps d'une classe
  getEmploiDuTemps: async (id_cli: number): Promise<EmploiDuTemps> => {
    const response = await api.get(`/emploiDuTemps?id_cli=${id_cli}`);
    return response.data[0];
  },
};