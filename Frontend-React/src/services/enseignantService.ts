import type { Enseignant } from "../models/enseignant";
import api from "./api";

export const enseignantService = {
  getAll: async (): Promise<Enseignant[]> => {
    const response = await api.get("/enseignants");
    return response.data;
  },

  getById: async (id: number): Promise<Enseignant> => {
    const response = await api.get(`/enseignants/${id}`);
    return response.data;
  },

  create: async (enseignant: Omit<Enseignant, "id">): Promise<Enseignant> => {
    const response = await api.post("/enseignants", enseignant);
    return response.data;
  },

  update: async (id: number, enseignant: Partial<Enseignant>): Promise<Enseignant> => {
    const response = await api.patch(`/enseignants/${id}`, enseignant);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/enseignants/${id}`);
  },
};