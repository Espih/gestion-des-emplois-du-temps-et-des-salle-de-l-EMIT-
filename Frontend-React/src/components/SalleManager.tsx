import React, { useState, useEffect, useCallback } from "react";
import type { Salle, SalleOccupationResponse } from "../types";
import { authFetch, API_URL } from "../services/authService";
import { ToastContainer } from "./ui/Toast";
import { useToast } from "../hooks/useToast";
import { ConfirmDialog } from "./ui/ConfirmDialog";

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

const isOccupeeMaintenant = (
  occupations: { jour: string; heureDebut: string; heureFin: string }[],
  reference: Date = new Date()
): { occupee: boolean; seance?: (typeof occupations)[0] } => {
  const jourActuel = reference.getDay();
  const heureActuelle = reference.getHours() * 60 + reference.getMinutes();
  const seanceEnCours = occupations.find((occ) => {
    const jourSeance = JOURS_MAP[occ.jour.toLowerCase()];
    if (jourSeance !== jourActuel) return false;
    return (
      heureActuelle >= heureEnMinutes(occ.heureDebut) &&
      heureActuelle < heureEnMinutes(occ.heureFin)
    );
  });
  return { occupee: !!seanceEnCours, seance: seanceEnCours };
};

const calculerDuree = (debut: string, fin: string): string => {
  const d = heureEnMinutes(debut),
    f = heureEnMinutes(fin);
  if (d < 0 || f < 0) return "—";
  const diff = f - d;
  const h = Math.floor(diff / 60),
    m = diff % 60;
  if (h > 0 && m > 0) return `${h}h${m.toString().padStart(2, "0")}`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
};

const ITEMS_PAR_PAGE = 5;

interface SalleAvecOccupations extends Salle {
  occupations: { jour: string; heureDebut: string; heureFin: string }[];
}

export default function SalleManager(): React.JSX.Element {
  const { toasts, addToast, removeToast } = useToast();

  // ── State ─────────────────────────────────────────────────────────────────
  const [salles, setSalles] = useState<SalleAvecOccupations[]>([]);
  const [selectedSalle, setSelectedSalle] =
    useState<SalleOccupationResponse | null>(null);
  const [nomSalle, setNomSalle] = useState("");
  const [capacite, setCapacite] = useState("30");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [now, setNow] = useState(new Date());
  const [rechercheSalle, setRechercheSalle] = useState("");

  // Dialog suppression
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    idSalle: number;
    nomSalle: string;
  }>({ open: false, idSalle: 0, nomSalle: "" });

  // Horloge 30s
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  // ── Chargement ────────────────────────────────────────────────────────────
  const chargerSalles = useCallback(async () => {
    setLoading(true);
    try {
      const [resSalles, resSeances] = await Promise.all([
        authFetch(`${API_URL}/datacontrollers/salles`),
        authFetch(`${API_URL}/datacontrollers/seances`),
      ]);
      if (!resSalles.ok || !resSeances.ok) throw new Error("Erreur chargement");
      const dataSalles = (await resSalles.json()) as Salle[];
      const dataSeances = await resSeances.json();
      const sallesEnrichies: SalleAvecOccupations[] = dataSalles.map((s) => ({
        ...s,
        occupations: dataSeances
          .filter((seq: { idSalle: number }) => seq.idSalle === s.idSalle)
          .map(
            (seq: { jour: string; heureDebut: string; heureFin: string }) => ({
              jour: seq.jour,
              heureDebut: seq.heureDebut,
              heureFin: seq.heureFin,
            })
          ),
      }));
      setSalles(sallesEnrichies);
    } catch {
      setSalles([]);
      addToast("Impossible de charger les salles.", "error");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;
    const t = setTimeout(() => {
      if (active) chargerSalles();
    }, 0);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [chargerSalles]);

  // ── Inspecter ─────────────────────────────────────────────────────────────
  const handleInspecter = async (id: number) => {
    const res = await authFetch(
      `${API_URL}/datacontrollers/salles/${id}/details`
    );
    if (res.ok) {
      const data = (await res.json()) as SalleOccupationResponse;
      setSelectedSalle(data);
      addToast(`Rapport de « ${data.salle.nomSalle} » chargé.`, "info");
    } else {
      addToast("Impossible de charger les détails de la salle.", "error");
    }
  };

  // ── Création ──────────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await authFetch(`${API_URL}/datacontrollers/salles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomSalle, capacite: Number(capacite) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur création.");
      }
      setNomSalle("");
      setCapacite("30");
      await chargerSalles();
      addToast(`Salle « ${nomSalle} » créée avec succès.`, "success");
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Erreur inconnue.",
        "error"
      );
    } finally {
      setCreating(false);
    }
  };

  // ── Suppression ───────────────────────────────────────────────────────────
  const demanderSuppression = (salle: SalleAvecOccupations) => {
    setConfirmDelete({
      open: true,
      idSalle: salle.idSalle,
      nomSalle: salle.nomSalle,
    });
  };

  const confirmerSuppression = async () => {
    const { idSalle, nomSalle: nom } = confirmDelete;
    setConfirmDelete((prev) => ({ ...prev, open: false }));
    try {
      const res = await authFetch(
        `${API_URL}/datacontrollers/salles/${idSalle}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Suppression échouée.");
      if (selectedSalle?.salle.idSalle === idSalle) setSelectedSalle(null);
      await chargerSalles();
      addToast(`Salle « ${nom} » supprimée.`, "success");
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Erreur suppression.",
        "error"
      );
    }
  };

  // ── Données paginées ──────────────────────────────────────────────────────
  const sallesUniques = Array.from(
    new Map(salles.map((s) => [s.idSalle, s])).values()
  )
    .map((s) => {
      const { occupee } = isOccupeeMaintenant(s.occupations, now);
      return {
        ...s,
        statut: occupee ? ("occupee" as const) : ("libre" as const),
      };
    })
    .filter((s) => {
      if (!rechercheSalle.trim()) return true;
      const q = rechercheSalle.toLowerCase().trim();
      return (
        s.nomSalle.toLowerCase().includes(q) ||
        s.capacite.toString().includes(q) ||
        s.statut.includes(q)
      );
    });

  const totalPages = Math.ceil(sallesUniques.length / ITEMS_PAR_PAGE);
  const pageActuelle = Math.min(page, Math.max(1, totalPages));
  const debutIdx = (pageActuelle - 1) * ITEMS_PAR_PAGE;
  const sallesPage = sallesUniques.slice(debutIdx, debutIdx + ITEMS_PAR_PAGE);

  const seanceEnCours = selectedSalle
    ? isOccupeeMaintenant(selectedSalle.occupations, now).seance
    : null;
  const detailSeanceEnCours = seanceEnCours
    ? selectedSalle?.occupations.find(
        (o) =>
          o.jour === seanceEnCours.jour &&
          o.heureDebut === seanceEnCours.heureDebut
      )
    : null;

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-blue-50 disabled:opacity-60";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5";

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <ConfirmDialog
        open={confirmDelete.open}
        title="Supprimer la salle"
        message={`Voulez-vous vraiment supprimer « ${confirmDelete.nomSalle} » ? Toutes les séances associées seront également affectées.`}
        confirmLabel="Supprimer"
        danger
        onConfirm={confirmerSuppression}
        onCancel={() => setConfirmDelete((prev) => ({ ...prev, open: false }))}
      />

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}
      >
        <div className="md:col-span-2 space-y-4">
          {/* ═══ FORMULAIRE CRÉATION ═══ */}
          <form
            onSubmit={handleCreate}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-4">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: `${emitNavy}15` }}
              >
                <svg
                  className="h-4 w-4"
                  style={{ color: emitNavy }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <h2 className="text-base font-bold" style={{ color: emitNavy }}>
                Nouvelle Salle
              </h2>
            </div>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className={labelClass}>Désignation</label>
                <input
                  value={nomSalle}
                  onChange={(e) => setNomSalle(e.target.value)}
                  className={inputClass}
                  placeholder="Ex: B001"
                  required
                  disabled={creating}
                />
              </div>
              <div className="w-32">
                <label className={labelClass}>Capacité</label>
                <input
                  type="number"
                  value={capacite}
                  onChange={(e) => setCapacite(e.target.value)}
                  className={inputClass}
                  required
                  disabled={creating}
                />
              </div>
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 h-[38px]"
                style={{ background: emitNavy }}
              >
                {creating ? (
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Création...
                  </>
                ) : (
                  "Créer"
                )}
              </button>
            </div>
          </form>

          {/* ═══ TABLE SALLES ═══ */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${emitGold}20` }}
                  >
                    <svg
                      className="h-4 w-4"
                      style={{ color: emitGold }}
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
                  </div>
                  <h2
                    className="text-base font-bold"
                    style={{ color: emitNavy }}
                  >
                    Salles d'études ({sallesUniques.length})
                  </h2>
                </div>
              </div>

              {/* Barre de recherche */}
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  type="text"
                  value={rechercheSalle}
                  onChange={(e) => {
                    setRechercheSalle(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Rechercher une salle..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-50 placeholder:text-slate-400"
                />
                {rechercheSalle && (
                  <button
                    onClick={() => setRechercheSalle("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase text-slate-500 border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold">Salle</th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Capacité
                    </th>
                    <th className="text-left px-4 py-3 font-semibold">
                      Statut
                    </th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-slate-400"
                      >
                        Chargement...
                      </td>
                    </tr>
                  ) : sallesPage.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-slate-400 italic"
                      >
                        Aucune salle
                      </td>
                    </tr>
                  ) : (
                    sallesPage.map((s) => (
                      <tr
                        key={s.idSalle}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs"
                              style={{
                                background: `${emitNavy}15`,
                                color: emitNavy,
                              }}
                            >
                              {s.nomSalle.substring(0, 3)}
                            </div>
                            <span className="font-semibold text-slate-900">
                              {s.nomSalle}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {s.capacite} places
                        </td>
                        <td className="px-4 py-3">
                          {s.statut === "occupee" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                              Occupée
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Libre
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleInspecter(s.idSalle)}
                              className="rounded-lg px-3 py-1.5 text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                            >
                              Inspecter
                            </button>
                            <button
                              onClick={() => demanderSuppression(s)}
                              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-500">
                  Page <strong>{pageActuelle}</strong> sur{" "}
                  <strong>{totalPages}</strong>
                  <span className="ml-2">
                    ({debutIdx + 1}–
                    {Math.min(debutIdx + ITEMS_PAR_PAGE, sallesUniques.length)}{" "}
                    sur {sallesUniques.length})
                  </span>
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pageActuelle === 1}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Précédent
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className="rounded-lg w-8 h-8 text-xs font-semibold transition"
                        style={{
                          background: n === pageActuelle ? emitNavy : "white",
                          color: n === pageActuelle ? "white" : "#475569",
                          border:
                            n === pageActuelle ? "none" : "1px solid #cbd5e1",
                        }}
                      >
                        {n}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={pageActuelle === totalPages}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ INSPECTEUR ═══ */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-4">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: `${emitNavy}15` }}
            >
              <svg
                className="h-4 w-4"
                style={{ color: emitNavy }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold" style={{ color: emitNavy }}>
              Inspecteur
            </h2>
          </div>

          {selectedSalle ? (
            <div className="space-y-4">
              <div className="rounded-xl p-4" style={{ background: emitNavy }}>
                <div className="text-xl font-bold text-white">
                  {selectedSalle.salle.nomSalle}
                </div>
                <div className="text-xs mt-1" style={{ color: emitGold }}>
                  Capacité : {selectedSalle.salle.capacite} places
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {detailSeanceEnCours ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-100 border border-red-400/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                      OCCUPÉE MAINTENANT
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/20 text-green-100 border border-green-400/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      LIBRE
                    </span>
                  )}
                </div>
              </div>

              {detailSeanceEnCours && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707
                           9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0
                           00-1.414-1.414L11 10.586V7z"
                      />
                    </svg>
                    En cours d'occupation
                  </h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="font-bold text-slate-900">
                      {
                        (
                          detailSeanceEnCours as SalleOccupationResponse["occupations"][0]
                        ).matiere
                      }
                    </div>
                    <div className="text-xs text-slate-700">
                      <span className="font-semibold">Occupant :</span>{" "}
                      {
                        (
                          detailSeanceEnCours as SalleOccupationResponse["occupations"][0]
                        ).enseignant
                      }{" "}
                      avec{" "}
                      <strong>
                        {
                          (
                            detailSeanceEnCours as SalleOccupationResponse["occupations"][0]
                          ).parcours
                        }{" "}
                        /{" "}
                        {
                          (
                            detailSeanceEnCours as SalleOccupationResponse["occupations"][0]
                          ).classe
                        }
                      </strong>
                    </div>
                    <div className="text-xs text-slate-700">
                      <span className="font-semibold">Durée :</span>{" "}
                      {detailSeanceEnCours.heureDebut} →{" "}
                      {detailSeanceEnCours.heureFin} (
                      {calculerDuree(
                        detailSeanceEnCours.heureDebut,
                        detailSeanceEnCours.heureFin
                      )}
                      )
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Toutes les occupations ({selectedSalle.occupations.length})
                </h3>
                {selectedSalle.occupations.length === 0 ? (
                  <div className="text-sm text-slate-500 italic bg-slate-50 rounded-lg p-3">
                    Aucune activité enregistrée.
                  </div>
                ) : (
                  selectedSalle.occupations.map((occ, idx) => {
                    const estEnCours =
                      detailSeanceEnCours &&
                      detailSeanceEnCours.heureDebut === occ.heureDebut &&
                      detailSeanceEnCours.jour === occ.jour;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border space-y-1.5 transition"
                        style={{
                          borderColor: estEnCours ? "#fca5a5" : "#e2e8f0",
                          background: estEnCours ? "#fef2f2" : "white",
                        }}
                      >
                        <div
                          className="flex justify-between text-xs font-bold"
                          style={{ color: emitNavy }}
                        >
                          <span>{occ.jour}</span>
                          <span>
                            {occ.heureDebut} - {occ.heureFin} ·{" "}
                            {calculerDuree(occ.heureDebut, occ.heureFin)}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          {occ.matiere}
                        </div>
                        <div className="text-xs text-slate-600">
                          <span className="font-semibold">Occupant :</span>{" "}
                          {occ.enseignant}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded"
                            style={{
                              background: `${emitGold}20`,
                              color: "#8b6f2a",
                            }}
                          >
                            {occ.parcours}
                          </span>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded"
                            style={{
                              background: `${emitNavy}15`,
                              color: emitNavy,
                            }}
                          >
                            {occ.classe}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic text-center py-8">
              Sélectionnez une salle pour voir son rapport.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
