import api from "./api";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error: unknown) {
    // On vérifie si l'erreur vient d'Axios de manière propre
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as { response: { data: { message?: string } } };
      const message =
        axiosError.response.data.message || "Identifiants incorrects";
      throw new Error(message, { cause: error });
    }

    throw new Error("Erreur de connexion au serveur.", { cause: error });
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
