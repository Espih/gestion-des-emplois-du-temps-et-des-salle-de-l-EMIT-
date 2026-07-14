import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword";
import DashboardManager from "./components/Dashboard";
import EdtManager from "./components/EdtManager";
import SalleManager from "./components/SalleManager";
import {
  authStorage,
  logout as authLogout,
  getCurrentUser,
  isAuthenticated,
  authFetch,
  API_URL,
} from "./services/authService";
import { useNotifications } from "./hooks/useNotifications";
import type { Salle } from "./types";

const emitNavy = "#1a3c6e";
const emitGold = "#c8a94e";

interface UserInfo {
  idUtilisateur: number;
  email: string;
}

type TabId = "dashboard" | "edt" | "salles";

const HEADER_INFO: Record<TabId, { title: string; sub: string }> = {
  dashboard: {
    title: "Tableau de Bord",
    sub: "Vue d'ensemble en temps réel",
  },
  edt: {
    title: "Emplois du Temps",
    sub: "Planification et organisation des séances",
  },
  salles: {
    title: "Gestion des Salles",
    sub: "Administration des salles et équipements",
  },
};

interface SalleAvecOccupations {
  idSalle: number;
  nomSalle: string;
  occupations: { jour: string; heureDebut: string; heureFin: string }[];
}

function Dashboard({ onLogout }: { onLogout: () => void }): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [sallesData, setSallesData] = useState<SalleAvecOccupations[]>([]);

  const chargerUtilisateur = useCallback(async () => {
    const data = await getCurrentUser();
    if (data) setUser(data);
  }, []);

  // Charger salles + séances pour les notifications
  const chargerSallesNotifs = useCallback(async () => {
    try {
      const [resSalles, resSeances] = await Promise.all([
        authFetch(`${API_URL}/datacontrollers/salles`),
        authFetch(`${API_URL}/datacontrollers/seances`),
      ]);
      if (!resSalles.ok || !resSeances.ok) return;
      const salles = (await resSalles.json()) as Salle[];
      const seances = await resSeances.json();

      const enrichies: SalleAvecOccupations[] = salles.map((s) => ({
        idSalle: s.idSalle,
        nomSalle: s.nomSalle,
        occupations: seances
          .filter((seq: { idSalle: number }) => seq.idSalle === s.idSalle)
          .map(
            (seq: { jour: string; heureDebut: string; heureFin: string }) => ({
              jour: seq.jour,
              heureDebut: seq.heureDebut,
              heureFin: seq.heureFin,
            })
          ),
      }));
      setSallesData(enrichies);
    } catch {
      /* silencieux */
    }
  }, []);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        chargerUtilisateur();
        chargerSallesNotifs();
      }
    }, 0);
    // Rafraîchir les données toutes les 60s pour les notifs
    const interval = setInterval(() => {
      if (active) chargerSallesNotifs();
    }, 60_000);
    return () => {
      active = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [chargerUtilisateur, chargerSallesNotifs]);

  // Hook notifications
  const {
    notifications,
    nbNonLues,
    marquerCommeLu,
    marquerToutLu,
    supprimer,
    supprimerTout,
  } = useNotifications(sallesData);

  // Fermer le panneau notifs au clic extérieur
  useEffect(() => {
    if (!showNotifs) return;
    const handleClick = () => setShowNotifs(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showNotifs]);

  const navItems = [
    {
      id: "dashboard" as const,
      label: "Tableau de Bord",
      icon: (
        <svg
          className="h-5 w-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
    },
    {
      id: "edt" as const,
      label: "Emplois du Temps",
      icon: (
        <svg
          className="h-5 w-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
      ),
    },
    {
      id: "salles" as const,
      label: "Gestion des Salles",
      icon: (
        <svg
          className="h-5 w-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
          />
        </svg>
      ),
    },
  ];

  const initiale = user?.email?.charAt(0).toUpperCase() || "?";
  const displayName = user?.email?.split("@")[0] || "Utilisateur";
  const displayEmail = user?.email || "Chargement...";
  const headerInfo = HEADER_INFO[activeTab];

  return (
    <div
      className="flex h-screen overflow-hidden antialiased"
      style={{
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        background: "#f1f5f9",
      }}
    >
      {/* ═══ SIDEBAR ═══ */}
      <aside
        className="flex w-[260px] flex-col h-full"
        style={{ background: emitNavy }}
      >
        <div
          className="flex items-center gap-3 px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <svg
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
            </svg>
          </div>
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.25em]"
              style={{ color: emitGold }}
            >
              Université
            </p>
            <p className="text-sm font-bold text-white">EMIT Planner</p>
          </div>
        </div>

        <div className="px-6 pt-6 pb-3">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Menu
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.12)"
                    : "transparent",
                  color: isActive ? "white" : "rgba(255,255,255,0.6)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  }
                }}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div
          className="px-3 pb-4 pt-4 space-y-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3 px-3 py-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
              style={{ background: emitGold, color: emitNavy }}
            >
              {initiale}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate capitalize">
                {displayName}
              </p>
              <p
                className="text-[11px] truncate"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {displayEmail}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150"
            style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.2)";
              e.currentTarget.style.color = "#fecaca";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              e.currentTarget.style.color = "#fca5a5";
            }}
          >
            <svg
              className="h-4 w-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ═══ CONTENU PRINCIPAL ═══ */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header
          className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm flex-shrink-0 z-10"
          style={{ position: "sticky", top: 0 }}
        >
          <div>
            <h1 className="text-lg font-bold" style={{ color: emitNavy }}>
              {headerInfo.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{headerInfo.sub}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* ── Cloche notifications ── */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifs(!showNotifs);
                }}
                className="relative h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                title="Notifications"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                {nbNonLues > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">
                      {nbNonLues > 9 ? "9+" : nbNonLues}
                    </span>
                  </span>
                )}
              </button>

              {/* ── Panneau notifications ── */}
              {showNotifs && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    animation: "notifIn 0.15s ease-out",
                  }}
                >
                  {/* Header panneau */}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3
                        className="text-sm font-bold"
                        style={{ color: emitNavy }}
                      >
                        Notifications
                      </h3>
                      {nbNonLues > 0 && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: emitNavy }}
                        >
                          {nbNonLues}
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="flex items-center gap-2">
                        {nbNonLues > 0 && (
                          <button
                            onClick={marquerToutLu}
                            className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 transition"
                          >
                            Tout lire
                          </button>
                        )}
                        <button
                          onClick={supprimerTout}
                          className="text-[10px] font-semibold text-red-400 hover:text-red-600 transition"
                        >
                          Effacer
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Liste */}
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                        <svg
                          className="h-10 w-10 text-slate-200 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.2}
                            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                          />
                        </svg>
                        <p className="text-xs text-slate-400">
                          Aucune notification
                        </p>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          Vous serez notifié quand une salle se libère
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-50">
                        {notifications.map((notif) => (
                          <li
                            key={notif.id}
                            className={`flex items-start gap-3 px-4 py-3 transition cursor-pointer hover:bg-slate-50 ${
                              !notif.lu ? "bg-blue-50/40" : ""
                            }`}
                            onClick={() => marquerCommeLu(notif.id)}
                          >
                            {/* Icône salle libre */}
                            <div
                              className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                              style={{
                                background: !notif.lu ? "#dcfce7" : "#f1f5f9",
                              }}
                            >
                              <svg
                                className="h-4 w-4"
                                style={{
                                  color: !notif.lu ? "#16a34a" : "#94a3b8",
                                }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.8}
                                  d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                />
                              </svg>
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs leading-tight ${
                                  !notif.lu
                                    ? "font-bold text-slate-900"
                                    : "font-medium text-slate-600"
                                }`}
                              >
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {notif.detail}
                              </p>
                            </div>

                            {/* Indicateur non lu */}
                            {!notif.lu && (
                              <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                            )}

                            {/* Bouton supprimer */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                supprimer(notif.id);
                              }}
                              className="shrink-0 text-slate-300 hover:text-red-400 transition mt-0.5"
                            >
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Avatar ── */}
            <div
              className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold cursor-default"
              style={{ background: emitGold, color: emitNavy }}
              title={displayEmail}
            >
              {initiale}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === "dashboard" && <DashboardManager />}
          {activeTab === "edt" && <EdtManager />}
          {activeTab === "salles" && <SalleManager />}
        </main>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes notifIn {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}

export default function App(): React.JSX.Element {
  const [authenticated, setAuthenticated] = useState<boolean>(
    isAuthenticated()
  );

  useEffect(() => {
    const handleAutoLogout = () => {
      authStorage.clear();
      setAuthenticated(false);
    };
    window.addEventListener("auth:logout", handleAutoLogout);
    return () => window.removeEventListener("auth:logout", handleAutoLogout);
  }, []);

  const handleLoginSuccess = () => setAuthenticated(true);

  const handleLogout = async () => {
    await authLogout();
    setAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
