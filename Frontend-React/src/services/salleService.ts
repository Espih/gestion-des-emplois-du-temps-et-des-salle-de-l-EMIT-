import type { Salle } from "../models/salle";
import api from "./api";

export const salleService = {
  getAll: async (): Promise<Salle[]> => {
    const response = await api.get("/salles");
    return response.data;
  },

  getById: async (id: number): Promise<Salle> => {
    const response = await api.get(`/salles/${id}`);
    return response.data;
  },

  create: async (salle: Omit<Salle, "id">): Promise<Salle> => {
    const response = await api.post("/salles", salle);
    return response.data;
  },

  update: async (id: number, salle: Partial<Salle>): Promise<Salle> => {
    const response = await api.patch(`/salles/${id}`, salle);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/salles/${id}`);
  },
};