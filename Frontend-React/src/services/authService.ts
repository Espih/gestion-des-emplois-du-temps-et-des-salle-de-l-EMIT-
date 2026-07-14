// src/services/authService.ts

const API_URL = "http://localhost:5183/api";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  EMAIL: "email",
} as const;

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  expiresIn: number;
}

// ─── STOCKAGE ────────────────────────────
export const authStorage = {
  getAccessToken: (): string | null =>
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  getRefreshToken: (): string | null =>
    localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  getEmail: (): string | null => localStorage.getItem(STORAGE_KEYS.EMAIL),

  setTokens: (accessToken: string, refreshToken: string, email?: string) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    if (email) localStorage.setItem(STORAGE_KEYS.EMAIL, email);
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.EMAIL);
  },
};

// ─── LOGIN ──────────────────────────────
export const login = async (
  email: string,
  motDePasse: string
): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, motDePasse }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Échec de la connexion");

  authStorage.setTokens(data.accessToken, data.refreshToken, data.email);
  return data;
};

// ─── LOGOUT ─────────────────────────────
export const logout = async (): Promise<void> => {
  const refreshToken = authStorage.getRefreshToken();
  const accessToken = authStorage.getAccessToken();

  if (refreshToken && accessToken) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // silencieux — on nettoie quand même
    }
  }

  authStorage.clear();
};

// ─── REFRESH TOKEN ──────────────────────
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) return null;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        authStorage.clear();
        return null;
      }

      const data = await res.json();
      authStorage.setTokens(data.accessToken, data.refreshToken, data.email);
      return data.accessToken;
    } catch {
      authStorage.clear();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// ─── FETCH AVEC AUTH AUTOMATIQUE ────────
export const authFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const accessToken = authStorage.getAccessToken();

  const buildHeaders = (token: string | null): HeadersInit => ({
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  // 1. Première tentative avec le token actuel
  let response = await fetch(url, {
    ...options,
    headers: buildHeaders(accessToken),
  });

  // 2. Si 401 → essayer de rafraîchir
  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      // Refresh échoué → déclencher event de déconnexion
      window.dispatchEvent(new CustomEvent("auth:logout"));
      return response;
    }

    // 3. Réessayer avec le nouveau token
    response = await fetch(url, {
      ...options,
      headers: buildHeaders(newToken),
    });
  }

  return response;
};

// ─── GET CURRENT USER ───────────────────
export const getCurrentUser = async (): Promise<{
  idUtilisateur: number;
  email: string;
} | null> => {
  try {
    const res = await authFetch(`${API_URL}/auth/me`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

// ─── VÉRIFIER SI SESSION VALIDE ─────────
export const isAuthenticated = (): boolean => {
  return !!authStorage.getAccessToken() && !!authStorage.getRefreshToken();
};

// ─── EXPORT DES CONSTANTES ──────────────
export { API_URL };
