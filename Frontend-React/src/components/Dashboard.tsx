import React, { useEffect, useState, useCallback, useRef } from "react";
import { authFetch, API_URL } from "../services/authService";
import type { Salle } from "../types";

const emitNavy = "#1a3c6e";
const emitGold = "#c8a94e";

const JOURS_MAP: Record<string, number> = {
  dimanche: 0,
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
};

const heureEnMinutes = (str: string): number => {
  if (!str) return -1;
  const m = str.match(/(\d{1,2})[h:]?(\d{0,2})/);
  if (!m) return -1;
  return parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) : 0);
};

const estOccupee = (
  occupations: { jour: string; heureDebut: string; heureFin: string }[],
  ref: Date
): boolean => {
  const jourActuel = ref.getDay();
  const heureActuelle = ref.getHours() * 60 + ref.getMinutes();
  return occupations.some((o) => {
    const j = JOURS_MAP[o.jour.toLowerCase()];
    if (j !== jourActuel) return false;
    return (
      heureActuelle >= heureEnMinutes(o.heureDebut) &&
      heureActuelle < heureEnMinutes(o.heureFin)
    );
  });
};

interface SeanceAPI {
  idSeance: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  idSalle: number;
  idEnseignant: number;
  idMatiere: number;
  idClasse: number;
  matiere?: { nomMatiere: string; couleur?: string };
  salle?: { nomSalle: string };
  enseignant?: { civilite: string; nom: string };
  classe?: { niveau: string };
}

interface SalleEnrichie extends Salle {
  occupations: { jour: string; heureDebut: string; heureFin: string }[];
}

interface DashStats {
  totalSalles: number;
  sallesLibres: number;
  sallesOccupees: number;
  totalSeances: number;
  seancesAujourdhui: SeanceAPI[];
  prochaine?: SeanceAPI;
  tauxOccupation: number;
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.JSX.Element;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18` }}
      >
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
          {label}
        </p>
        <p
          className="text-2xl font-extrabold mt-0.5"
          style={{ color: emitNavy }}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardManager(): React.JSX.Element {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const initialLoadDone = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const charger = useCallback(async () => {
    setLoading(true);
    try {
      const [rSalles, rSeances] = await Promise.all([
        authFetch(`${API_URL}/datacontrollers/salles`),
        authFetch(`${API_URL}/datacontrollers/seances`),
      ]);
      if (!rSalles.ok || !rSeances.ok) throw new Error();

      const dataSalles = (await rSalles.json()) as Salle[];
      const dataSeances = (await rSeances.json()) as SeanceAPI[];

      const currentTime = new Date();

      const sallesEnrichies: SalleEnrichie[] = dataSalles.map((s) => ({
        ...s,
        occupations: dataSeances
          .filter((seq) => seq.idSalle === s.idSalle)
          .map((seq) => ({
            jour: seq.jour,
            heureDebut: seq.heureDebut,
            heureFin: seq.heureFin,
          })),
      }));

      const jourActuel = currentTime.getDay();
      const heureActuelle =
        currentTime.getHours() * 60 + currentTime.getMinutes();

      const seancesAujourdhui = dataSeances.filter(
        (s) => JOURS_MAP[s.jour?.toLowerCase()] === jourActuel
      );

      const prochaine = seancesAujourdhui
        .filter((s) => heureEnMinutes(s.heureDebut) > heureActuelle)
        .sort(
          (a, b) => heureEnMinutes(a.heureDebut) - heureEnMinutes(b.heureDebut)
        )[0];

      const sallesOccupees = sallesEnrichies.filter((s) =>
        estOccupee(s.occupations, currentTime)
      ).length;

      const tauxOccupation =
        dataSalles.length > 0
          ? Math.round((sallesOccupees / dataSalles.length) * 100)
          : 0;

      setStats({
        totalSalles: dataSalles.length,
        sallesLibres: dataSalles.length - sallesOccupees,
        sallesOccupees,
        totalSeances: dataSeances.length,
        seancesAujourdhui,
        prochaine,
        tauxOccupation,
      });
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      charger();
    }
  }, [charger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin"
            style={{ color: emitNavy }}
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-slate-500">
            Chargement du tableau de bord…
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-slate-400 italic">
          Impossible de charger les données.
        </p>
      </div>
    );
  }

  const heureStr = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const jourStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="space-y-6"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="text-xl font-extrabold capitalize"
            style={{ color: emitNavy }}
          >
            {jourStr}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Heure actuelle :{" "}
            <strong className="text-slate-600">{heureStr}</strong>
          </p>
        </div>
        <button
          onClick={charger}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total séances"
          value={stats.totalSeances}
          sub="Dans l'emploi du temps"
          accent={emitNavy}
          icon={
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          }
        />
        <StatCard
          label="Séances aujourd'hui"
          value={stats.seancesAujourdhui.length}
          sub={`Sur ${stats.totalSeances} au total`}
          accent="#6366f1"
          icon={
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
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          label="Salles libres"
          value={stats.sallesLibres}
          sub={`Sur ${stats.totalSalles} salles`}
          accent="#16a34a"
          icon={
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
                d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15"
              />
            </svg>
          }
        />
        <StatCard
          label="Salles occupées"
          value={stats.sallesOccupees}
          sub={`Taux : ${stats.tauxOccupation}%`}
          accent="#dc2626"
          icon={
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
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          }
        />
      </div>

      {/* Taux occupation + Prochaine séance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jauge circulaire */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold" style={{ color: emitNavy }}>
            Taux d'occupation actuel
          </h3>
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke={
                    stats.tauxOccupation > 70
                      ? "#dc2626"
                      : stats.tauxOccupation > 40
                      ? emitGold
                      : "#16a34a"
                  }
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${stats.tauxOccupation} ${
                    100 - stats.tauxOccupation
                  }`}
                  style={{ transition: "stroke-dasharray 0.6s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-2xl font-extrabold"
                  style={{ color: emitNavy }}
                >
                  {stats.tauxOccupation}%
                </span>
                <span className="text-[10px] text-slate-400">occupation</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: "Libres", count: stats.sallesLibres, color: "#16a34a" },
              {
                label: "Occupées",
                count: stats.sallesOccupees,
                color: "#dc2626",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="text-slate-600 font-medium">
                    {item.label}
                  </span>
                </div>
                <span className="font-bold text-slate-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prochaine séance + Liste séances du jour */}
        <div className="lg:col-span-2 space-y-4">
          {/* Prochaine séance */}
          {stats.prochaine ? (
            <div
              className="rounded-2xl p-5 text-white"
              style={{
                background: `linear-gradient(135deg, ${emitNavy} 0%, #2a5298 100%)`,
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">
                Prochaine séance aujourd'hui
              </p>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-lg font-extrabold leading-tight">
                    {stats.prochaine.matiere?.nomMatiere ?? "—"}
                  </p>
                  <p className="text-sm opacity-80">
                    {stats.prochaine.enseignant?.civilite}{" "}
                    {stats.prochaine.enseignant?.nom}
                  </p>
                  <p className="text-xs opacity-60">
                    {stats.prochaine.classe?.niveau} ·{" "}
                    {stats.prochaine.salle?.nomSalle}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold" style={{ color: emitGold }}>
                    {stats.prochaine.heureDebut}
                  </p>
                  <p className="text-xs opacity-60 mt-0.5">
                    → {stats.prochaine.heureFin}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-sm text-slate-400 italic">
                Aucune séance à venir aujourd'hui.
              </p>
            </div>
          )}

          {/* Liste séances du jour */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold" style={{ color: emitNavy }}>
                Séances du jour ({stats.seancesAujourdhui.length})
              </h3>
            </div>
            {stats.seancesAujourdhui.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-8">
                Aucune séance programmée aujourd'hui.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {stats.seancesAujourdhui
                  .sort(
                    (a, b) =>
                      heureEnMinutes(a.heureDebut) -
                      heureEnMinutes(b.heureDebut)
                  )
                  .map((s) => {
                    const hDebut = heureEnMinutes(s.heureDebut);
                    const hFin = heureEnMinutes(s.heureFin);
                    const hNow = now.getHours() * 60 + now.getMinutes();
                    const enCours = hNow >= hDebut && hNow < hFin;

                    return (
                      <li
                        key={s.idSeance}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition"
                      >
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{
                            background: enCours ? "#16a34a" : "#cbd5e1",
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {s.matiere?.nomMatiere ?? "—"}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {s.classe?.niveau} · {s.salle?.nomSalle} ·{" "}
                            {s.enseignant?.civilite} {s.enseignant?.nom}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p
                            className="text-xs font-bold"
                            style={{ color: emitNavy }}
                          >
                            {s.heureDebut}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {s.heureFin}
                          </p>
                        </div>
                        {enCours && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
                            En cours
                          </span>
                        )}
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
