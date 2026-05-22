import type { Matiere } from "../models/matiere";
import api from "./api";


export const matiereService = {
  getAll: async (): Promise<Matiere[]> => {
    const response = await api.get("/matieres");
    return response.data;
  },

  getById: async (id: number): Promise<Matiere> => {
    const response = await api.get(`/matieres/${id}`);
    return response.data;
  },

  create: async (matiere: Omit<Matiere, "id">): Promise<Matiere> => {
    const response = await api.post("/matieres", matiere);
    return response.data;
  },

  update: async (id: number, matiere: Partial<Matiere>): Promise<Matiere> => {
    const response = await api.patch(`/matieres/${id}`, matiere);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/matieres/${id}`);
  },
};