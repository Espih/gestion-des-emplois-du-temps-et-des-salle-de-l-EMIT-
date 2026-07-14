import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5183/api",
  headers: { "Content-Type": "application/json" },
});

// Intercepteur de requête (Sécurité : Injection du token JWT)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse (Gestionnaire d'erreurs global)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Sécurité : Si le token n'est plus valide ou expiré, déconnexion forcée
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirection automatique vers l'écran de Login
    } else if (status === 403) {
      console.error("Accès refusé : Droits insuffisants.");
    } else if (status === 500) {
      console.error(
        "Erreur critique serveur : ",
        error.response?.data?.message
      );
    }

    return Promise.reject(error);
  }
);

export default api;
