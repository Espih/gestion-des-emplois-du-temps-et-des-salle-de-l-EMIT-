import React, { useState, useCallback, useRef } from "react";
import { login as authLogin } from "../services/authService";

interface LoginProps {
  onLoginSuccess: () => void;
}

type View = "login" | "forgot" | "forgot-sent";

export default function Login({
  onLoginSuccess,
}: LoginProps): React.JSX.Element {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailChecked, setEmailChecked] = useState<null | boolean>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitNavy = "#1a3c6e";
  const emitGold = "#c8a94e";

  // ── Vérification email en temps réel ──
  const checkEmail = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value || !value.includes("@")) {
      setEmailChecked(null);
      return;
    }
    setCheckingEmail(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:5183/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: value }),
        });
        const data = await res.json();
        setEmailChecked(data.exists);
      } catch {
        setEmailChecked(null);
      } finally {
        setCheckingEmail(false);
      }
    }, 600);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    checkEmail(val);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authLogin(email, password);
      onLoginSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5183/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur");
      setView("forgot-sent");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-100 p-4 antialiased sm:p-6"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
    >
      <div className="flex w-full max-w-[960px] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-300/50">
        {/* ═══ PANEL GAUCHE — Illustration Bureau ═══ */}
        <div
          className="hidden w-[45%] lg:flex lg:flex-col lg:items-center lg:justify-center"
          style={{ background: emitNavy }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center px-10 py-12">
            {/* Illustration SVG — Bureau / Espace de travail */}
            <svg
              viewBox="0 0 500 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-[300px] mb-8"
            >
              {/* Bureau / Table */}
              <rect
                x="100"
                y="220"
                width="300"
                height="12"
                rx="6"
                fill="#2a5694"
              />
              <rect
                x="130"
                y="232"
                width="12"
                height="80"
                rx="4"
                fill="#234b85"
              />
              <rect
                x="358"
                y="232"
                width="12"
                height="80"
                rx="4"
                fill="#234b85"
              />

              {/* Écran moniteur */}
              <rect
                x="170"
                y="100"
                width="160"
                height="110"
                rx="10"
                fill="#15325a"
              />
              <rect
                x="178"
                y="108"
                width="144"
                height="90"
                rx="4"
                fill="#a8c4e0"
                opacity="0.2"
              />

              {/* Contenu écran — grille emploi du temps */}
              <rect
                x="190"
                y="118"
                width="50"
                height="6"
                rx="3"
                fill={emitGold}
                opacity="0.7"
              />
              <rect
                x="248"
                y="118"
                width="36"
                height="6"
                rx="3"
                fill={emitGold}
                opacity="0.5"
              />
              <rect
                x="190"
                y="132"
                width="120"
                height="4"
                rx="2"
                fill="#a8c4e0"
                opacity="0.3"
              />
              <rect
                x="190"
                y="142"
                width="95"
                height="4"
                rx="2"
                fill="#a8c4e0"
                opacity="0.25"
              />
              <rect
                x="190"
                y="152"
                width="110"
                height="4"
                rx="2"
                fill="#a8c4e0"
                opacity="0.3"
              />
              <rect
                x="190"
                y="162"
                width="80"
                height="4"
                rx="2"
                fill="#a8c4e0"
                opacity="0.25"
              />
              <rect
                x="190"
                y="172"
                width="105"
                height="4"
                rx="2"
                fill="#a8c4e0"
                opacity="0.3"
              />
              <rect
                x="190"
                y="182"
                width="70"
                height="4"
                rx="2"
                fill="#a8c4e0"
                opacity="0.2"
              />

              {/* Pied écran */}
              <rect
                x="230"
                y="210"
                width="40"
                height="10"
                rx="3"
                fill="#234b85"
              />
              <rect
                x="220"
                y="217"
                width="60"
                height="6"
                rx="3"
                fill="#2a5694"
              />

              {/* Tasse de café */}
              <rect
                x="360"
                y="195"
                width="28"
                height="25"
                rx="6"
                fill="#2a5694"
              />
              <rect
                x="365"
                y="200"
                width="18"
                height="15"
                rx="4"
                fill="#3b6aa0"
              />
              <path
                d="M388 202 C395 202, 395 214, 388 214"
                stroke="#2a5694"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              {/* Fumée */}
              <path
                d="M372 190 C372 183, 378 185, 378 178"
                stroke="#a8c4e0"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M379 192 C379 185, 385 187, 385 180"
                stroke="#a8c4e0"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.3"
              />

              {/* Livre / cahier */}
              <rect
                x="110"
                y="200"
                width="45"
                height="20"
                rx="3"
                fill="#2a5694"
              />
              <rect
                x="112"
                y="202"
                width="41"
                height="16"
                rx="2"
                fill="#3b6aa0"
              />
              <rect
                x="118"
                y="207"
                width="25"
                height="3"
                rx="1"
                fill={emitGold}
                opacity="0.5"
              />
              <rect
                x="118"
                y="212"
                width="18"
                height="3"
                rx="1"
                fill={emitGold}
                opacity="0.3"
              />

              {/* Plante */}
              <rect
                x="80"
                y="180"
                width="22"
                height="40"
                rx="5"
                fill="#2a5694"
              />
              <ellipse cx="91" cy="172" rx="18" ry="20" fill="#234b85" />
              <ellipse cx="86" cy="165" rx="10" ry="14" fill="#1f4275" />
              <ellipse cx="97" cy="168" rx="8" ry="12" fill="#1f4275" />

              {/* Calendrier mural */}
              <rect
                x="350"
                y="60"
                width="70"
                height="80"
                rx="6"
                fill="#234b85"
              />
              <rect
                x="350"
                y="60"
                width="70"
                height="20"
                rx="6"
                fill="#2a5694"
              />
              <rect
                x="350"
                y="72"
                width="70"
                height="8"
                rx="0"
                fill="#2a5694"
              />
              {[0, 1, 2, 3].map((row) =>
                [0, 1, 2, 3, 4].map((col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={358 + col * 12}
                    y={88 + row * 12}
                    width="8"
                    height="8"
                    rx="2"
                    fill={row === 1 && col === 2 ? emitGold : "#3b6aa0"}
                    opacity={row === 1 && col === 2 ? 0.9 : 0.4}
                  />
                ))
              )}

              {/* Horloge murale */}
              <circle cx="120" cy="80" r="28" fill="#234b85" />
              <circle
                cx="120"
                cy="80"
                r="24"
                fill="#15325a"
                stroke="#3b6aa0"
                strokeWidth="2"
              />
              <line
                x1="120"
                y1="80"
                x2="120"
                y2="64"
                stroke={emitGold}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="120"
                y1="80"
                x2="134"
                y2="80"
                stroke={emitGold}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="120" cy="80" r="3" fill={emitGold} />
            </svg>

            <div className="text-center">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-2"
                style={{ color: emitGold }}
              >
                Université EMIT
              </p>
              <h2 className="text-lg font-bold text-white leading-snug">
                Gestion des Salles
                <br />& Emplois du Temps
              </h2>
              <p
                className="mt-3 text-sm leading-6 max-w-[240px] mx-auto"
                style={{ color: "#a8c4e0" }}
              >
                Plateforme centralisée pour la gestion pédagogique et
                l'organisation universitaire.
              </p>
            </div>

            <div className="mt-auto pt-8">
              <p className="text-[11px]" style={{ color: "#3b6aa0" }}>
                © 2026 EMIT — Tous droits réservés
              </p>
            </div>
          </div>
        </div>

        {/* ═══ PANEL DROIT — Formulaire ═══ */}
        <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-[55%] lg:px-14 lg:py-12">
          {/* Logo bloc avec icône */}
          <div className="mb-8 flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl shadow-md"
              style={{ background: emitNavy }}
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                Plateforme
              </p>
              <p className="text-sm font-bold" style={{ color: emitNavy }}>
                EMIT Planner
              </p>
            </div>
          </div>

          {/* ── VUE : LOGIN ── */}
          {view === "login" && (
            <>
              <div className="mb-6">
                <h1
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: emitNavy }}
                >
                  Connexion
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Accédez à votre espace de gestion.
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <svg
                    className="h-4 w-4 shrink-0 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="w-full rounded-xl border bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-4 focus:ring-blue-50"
                      style={{
                        borderColor:
                          emailChecked === false
                            ? "#ef4444"
                            : emailChecked === true
                            ? "#22c55e"
                            : "#cbd5e1",
                      }}
                      placeholder="example@gmail.com"
                      autoComplete="username"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingEmail && (
                        <svg
                          className="h-4 w-4 animate-spin text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      )}
                      {!checkingEmail && emailChecked === true && (
                        <svg
                          className="h-4 w-4 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                      {!checkingEmail && emailChecked === false && (
                        <svg
                          className="h-4 w-4 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  {emailChecked === false && (
                    <p className="text-xs text-red-500 mt-1">
                      Cette adresse email n'est pas reconnue.
                    </p>
                  )}
                </div>

                {/* Mot de passe */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-4 focus:ring-blue-50"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? (
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
                            d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
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
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.8}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Lien mot de passe oublié */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setError("");
                    }}
                    className="text-xs font-medium transition hover:underline"
                    style={{ color: emitNavy }}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                {/* Bouton connexion */}
                <button
                  type="submit"
                  disabled={loading || emailChecked === false}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: emitNavy }}
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Connexion...</span>
                    </>
                  ) : (
                    <span>Se connecter</span>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── VUE : MOT DE PASSE OUBLIÉ ── */}
          {view === "forgot" && (
            <>
              <div className="mb-6">
                <h1
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: emitNavy }}
                >
                  Mot de passe oublié
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Entrez votre email pour recevoir un lien de réinitialisation.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="forgot-email"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Adresse email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-4 focus:ring-blue-50"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
                  style={{ background: emitNavy }}
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Envoi...</span>
                    </>
                  ) : (
                    <span>Envoyer le lien</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError("");
                  }}
                  className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-700 transition"
                >
                  ← Retour à la connexion
                </button>
              </form>
            </>
          )}

          {/* ── VUE : EMAIL ENVOYÉ ── */}
          {view === "forgot-sent" && (
            <div className="text-center py-6">
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: `${emitGold}20` }}
              >
                <svg
                  className="h-8 w-8"
                  style={{ color: emitGold }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: emitNavy }}
              >
                Email envoyé !
              </h2>
              <p className="text-sm text-slate-500 max-w-xs mx-auto leading-6">
                Si l'adresse <strong className="text-slate-700">{email}</strong>{" "}
                est associée à un compte, vous recevrez un lien de
                réinitialisation.
              </p>
              <button
                onClick={() => {
                  setView("login");
                  setError("");
                }}
                className="mt-6 text-sm font-semibold transition hover:underline"
                style={{ color: emitNavy }}
              >
                ← Retour à la connexion
              </button>
            </div>
          )}

          <p className="mt-8 text-center text-[11px] text-slate-400">
            Accès réservé au personnel autorisé de l'EMIT.
          </p>
        </div>
      </div>
    </div>
  );
}
