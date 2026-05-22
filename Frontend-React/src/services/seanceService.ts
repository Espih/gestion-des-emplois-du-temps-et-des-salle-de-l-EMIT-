import type { Seance } from "../models/seance";
import api from "./api";

export const seanceService = {
  getAll: async (): Promise<Seance[]> => {
    const response = await api.get("/seances");
    return response.data;
  },

  getById: async (id: number): Promise<Seance> => {
    const response = await api.get(`/seances/${id}`);
    return response.data;
  },

  create: async (seance: Omit<Seance, "id_seance">): Promise<Seance> => {
    const response = await api.post("/seances", seance);
    return response.data;
  },

  update: async (id: number, seance: Partial<Seance>): Promise<Seance> => {
    const response = await api.patch(`/seances/${id}`, seance);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/seances/${id}`);
  },

  // Récupérer les séances par classe
  getByClasse: async (id_cli: number): Promise<Seance[]> => {
    const response = await api.get(`/seances?id_cli=${id_cli}`);
    return response.data;
  },

  // Récupérer les séances par enseignant (via matiere)
  getByEnseignant: async (id: number): Promise<Seance[]> => {
    const response = await api.get(`/seances?id=${id}`);
    return response.data;
  },
};