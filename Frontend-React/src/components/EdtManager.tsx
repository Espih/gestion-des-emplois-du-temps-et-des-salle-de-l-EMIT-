import React, { useState, useEffect, useCallback } from "react";
import type { Seance, Metadata } from "../types";
import { authFetch, API_URL } from "../services/authService";
import { ToastContainer } from "./ui/Toast";
import { useToast } from "../hooks/useToast";
import { ConfirmDialog } from "./ui/ConfirmDialog";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const CRENEAUX = [
  "07h00 - 8h00",
  "8h00 - 9h00",
  "9h00 - 10h00",
  "10h00 - 11h00",
  "11h00 - 12h00",
  "12h00 - 13h00",
  "13h00 - 14h00",
  "14h00 - 15h00",
  "15h00 - 16h00",
  "16h00 - 17h00",
  "17h00 - 18h00",
];

const emitNavy = "#1a3c6e";
const emitGold = "#c8a94e";

const heureEnMinutes = (str: string): number => {
  if (!str) return -1;
  const match = str.match(/(\d{1,2})[h:]?(\d{0,2})/);
  if (!match) return -1;
  return parseInt(match[1], 10) * 60 + (match[2] ? parseInt(match[2], 10) : 0);
};

const parseSlot = (slot: string): { debut: number; fin: number } => {
  const parts = slot.split("-");
  return {
    debut: heureEnMinutes(parts[0]),
    fin: heureEnMinutes(parts[1] || ""),
  };
};

export default function EdtManager(): React.JSX.Element {
  const { toasts, addToast, removeToast } = useToast();

  // ── State ─────────────────────────────────────────────────────────────────
  const [seances, setSeances] = useState<Seance[]>([]);
  const [meta, setMeta] = useState<Metadata>({
    mentions: [],
    parcours: [],
    classes: [],
    enseignants: [],
    matieres: [],
    salles: [],
  });

  const [filtreMention, setFiltreMention] = useState<number>(0);
  const [filtreParcours, setFiltreParcours] = useState<number>(0);
  const [filtreClasse, setFiltreClasse] = useState<string>("");

  const [selectedMention, setSelectedMention] = useState<number>(0);
  const [selectedParcours, setSelectedParcours] = useState<number>(0);

  const [savingSeance, setSavingSeance] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Dialog suppression
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    idSeance: number;
    label: string;
  }>({ open: false, idSeance: 0, label: "" });

  const [formData, setFormData] = useState<
    Omit<Seance, "idSeance"> & { idSeance: number }
  >({
    idSeance: 0,
    jour: "Lundi",
    heureDebut: "8h00",
    heureFin: "10h00",
    idSalle: 0,
    idEnseignant: 0,
    idMatiere: 0,
    idClasse: 0,
  });

  // ── Cascades ─────────────────────────────────────────────────────────────
  const parcoursFiltres = meta.parcours.filter(
    (p) => selectedMention === 0 || p.idMention === selectedMention
  );
  const classesFiltrees = meta.classes.filter(
    (c) => selectedParcours === 0 || c.idParcours === selectedParcours
  );
  const parcoursGridFiltres = meta.parcours.filter(
    (p) => filtreMention === 0 || p.idMention === filtreMention
  );
  const classesGridFiltrees = meta.classes.filter(
    (c) => filtreParcours === 0 || c.idParcours === filtreParcours
  );

  const seancesFiltrees = seances.filter(
    (s) => !filtreClasse || s.idClasse === Number(filtreClasse)
  );
  const nbSeancesVisibles = seancesFiltrees.length;
  const filtresActifs =
    filtreMention > 0 || filtreParcours > 0 || filtreClasse !== "";
  const pdfDisponible =
    filtreClasse !== "" && nbSeancesVisibles > 0 && !downloadingPdf;

  // ── Chargement ────────────────────────────────────────────────────────────
  const chargerDonnees = useCallback(async () => {
    try {
      const [resSeances, resMeta, resSalles] = await Promise.all([
        authFetch(`${API_URL}/datacontrollers/seances`),
        authFetch(`${API_URL}/datacontrollers/meta`),
        authFetch(`${API_URL}/datacontrollers/salles`),
      ]);
      if (!resSeances.ok || !resMeta.ok || !resSalles.ok)
        throw new Error("Échec du chargement.");
      const dataSeances = (await resSeances.json()) as Seance[];
      const dataMeta = (await resMeta.json()) as Omit<Metadata, "salles">;
      const dataSalles = await resSalles.json();
      setSeances(dataSeances);
      setMeta({ ...dataMeta, salles: dataSalles });
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Erreur inconnue.",
        "error"
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    let active = true;
    const t = setTimeout(() => {
      if (active) chargerDonnees();
    }, 0);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [chargerDonnees]);

  // ── Sauvegarde séance ─────────────────────────────────────────────────────
  const handleSaveSeance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idClasse) {
      addToast("Veuillez sélectionner une classe.", "warning");
      return;
    }
    setSavingSeance(true);
    const isEdit = formData.idSeance > 0;
    const normaliserHeure = (h: string) => h.replace(/(\d+)h(\d+)/i, "$1:$2");
    const payload = {
      ...formData,
      heureDebut: normaliserHeure(formData.heureDebut),
      heureFin: normaliserHeure(formData.heureFin),
      idClasse: Number(formData.idClasse),
      idSalle: Number(formData.idSalle),
      idEnseignant: Number(formData.idEnseignant),
      idMatiere: Number(formData.idMatiere),
    };
    const url = `${API_URL}/datacontrollers/seances${
      isEdit ? "/" + formData.idSeance : ""
    }`;
    try {
      const res = await authFetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erreur lors de la sauvegarde.");
      }
      await chargerDonnees();
      clearForm();
      addToast(
        isEdit ? "Séance modifiée avec succès." : "Séance ajoutée avec succès.",
        "success"
      );
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Erreur inconnue.",
        "error"
      );
    } finally {
      setSavingSeance(false);
    }
  };

  // ── Suppression ───────────────────────────────────────────────────────────
  const demanderSuppression = (seance: Seance) => {
    const label = seance.matiere?.nomMatiere
      ? `« ${seance.matiere.nomMatiere} »`
      : `séance #${seance.idSeance}`;
    setConfirmDelete({ open: true, idSeance: seance.idSeance, label });
  };

  const confirmerSuppression = async () => {
    const { idSeance } = confirmDelete;
    setConfirmDelete((prev) => ({ ...prev, open: false }));
    try {
      const res = await authFetch(
        `${API_URL}/datacontrollers/seances/${idSeance}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Suppression échouée.");
      await chargerDonnees();
      addToast("Séance supprimée.", "success");
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Erreur suppression.",
        "error"
      );
    }
  };

  // ── Édition ───────────────────────────────────────────────────────────────
  const handleEditSeance = (seance: Seance) => {
    const classe = meta.classes.find((c) => c.idClasse === seance.idClasse);
    if (classe) {
      const parcours = meta.parcours.find(
        (p) => p.idParcours === classe.idParcours
      );
      if (parcours) {
        setSelectedMention(parcours.idMention);
        setSelectedParcours(parcours.idParcours);
      }
    }
    setFormData({ ...seance });
    window.scrollTo({ top: 0, behavior: "smooth" });
    addToast("Séance chargée dans le formulaire.", "info");
  };

  // ── PDF ───────────────────────────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    if (!filtreClasse) {
      addToast(
        "Veuillez sélectionner une classe pour générer le PDF.",
        "warning"
      );
      return;
    }
    setDownloadingPdf(true);
    try {
      const res = await authFetch(
        `${API_URL}/datacontrollers/edt/pdf/${filtreClasse}`
      );
      if (!res.ok) throw new Error("Échec de la génération PDF.");
      const contentDisposition = res.headers.get("Content-Disposition");
      let fileName = "EDT.pdf";
      if (contentDisposition) {
        const matchStar = contentDisposition.match(
          /filename\*=UTF-8''([^;]+)/i
        );
        const match = contentDisposition.match(/filename="?([^";]+)"?/i);
        if (matchStar) fileName = decodeURIComponent(matchStar[1]);
        else if (match) fileName = match[1];
      } else {
        const classe = meta.classes.find(
          (c) => c.idClasse === Number(filtreClasse)
        );
        const parcours = meta.parcours.find(
          (p) => p.idParcours === classe?.idParcours
        );
        fileName = `EDT_${parcours?.nomParcours || "X"}_${
          classe?.niveau || "X"
        }.pdf`;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addToast(`PDF « ${fileName} » téléchargé avec succès.`, "success");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Erreur PDF.", "error");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // ── Helpers form ──────────────────────────────────────────────────────────
  const clearForm = () => {
    setFormData({
      idSeance: 0,
      jour: "Lundi",
      heureDebut: "8h00",
      heureFin: "10h00",
      idSalle: 0,
      idEnseignant: 0,
      idMatiere: 0,
      idClasse: 0,
    });
    setSelectedMention(0);
    setSelectedParcours(0);
  };

  const resetFiltres = () => {
    setFiltreMention(0);
    setFiltreParcours(0);
    setFiltreClasse("");
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5";

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <ConfirmDialog
        open={confirmDelete.open}
        title="Supprimer la séance"
        message={`Voulez-vous vraiment supprimer la ${confirmDelete.label} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        danger
        onConfirm={confirmerSuppression}
        onCancel={() => setConfirmDelete((prev) => ({ ...prev, open: false }))}
      />

      <div
        className="space-y-6"
        style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}
      >
        {/* ═══ BARRE FILTRES ═══ */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[180px]">
              <label className={labelClass}>Mention</label>
              <select
                value={filtreMention}
                onChange={(e) => {
                  setFiltreMention(Number(e.target.value));
                  setFiltreParcours(0);
                  setFiltreClasse("");
                }}
                className={inputClass}
              >
                <option value={0}>Toutes</option>
                {meta.mentions.map((m) => (
                  <option key={m.idMention} value={m.idMention}>
                    {m.nomMention}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[180px]">
              <label className={labelClass}>Parcours</label>
              <select
                value={filtreParcours}
                onChange={(e) => {
                  setFiltreParcours(Number(e.target.value));
                  setFiltreClasse("");
                }}
                className={inputClass}
                disabled={!filtreMention}
              >
                <option value={0}>Tous</option>
                {parcoursGridFiltres.map((p) => (
                  <option key={p.idParcours} value={p.idParcours}>
                    {p.nomParcours}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[180px]">
              <label className={labelClass}>Niveau</label>
              <select
                value={filtreClasse}
                onChange={(e) => setFiltreClasse(e.target.value)}
                className={inputClass}
                disabled={!filtreParcours}
              >
                <option value="">Tous</option>
                {classesGridFiltrees.map((c) => (
                  <option key={c.idClasse} value={c.idClasse}>
                    {c.niveau}
                  </option>
                ))}
              </select>
            </div>

            {filtresActifs && (
              <button
                onClick={resetFiltres}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition h-[38px]"
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
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993
                       0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25
                       0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Réinitialiser
              </button>
            )}

            <button
              onClick={handleDownloadPdf}
              disabled={!pdfDisponible}
              title={
                !filtreClasse ? "Sélectionnez une classe" : "Télécharger PDF"
              }
              className="ml-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 h-[38px]"
              style={{ background: emitNavy }}
            >
              {downloadingPdf ? (
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
                  Génération...
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125
                         1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0
                         12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125
                         1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0
                         1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  Télécharger PDF
                </>
              )}
            </button>
          </div>

          {filtresActifs && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044
                     a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659
                     1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25
                     2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774
                     c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                />
              </svg>
              <span>
                <strong className="text-slate-700">{nbSeancesVisibles}</strong>{" "}
                séance{nbSeancesVisibles > 1 ? "s" : ""} affichée
                {nbSeancesVisibles > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* ═══ CONTENU ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORMULAIRE */}
          <form
            onSubmit={handleSaveSeance}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 h-fit"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
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
                    d={
                      formData.idSeance > 0
                        ? "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                        : "M12 4.5v15m7.5-7.5h-15"
                    }
                  />
                </svg>
              </div>
              <h2 className="text-base font-bold" style={{ color: emitNavy }}>
                {formData.idSeance > 0
                  ? "Modifier la séance"
                  : "Nouvelle séance"}
              </h2>
            </div>

            {/* Mention */}
            <div>
              <label className={labelClass}>Mention</label>
              <select
                value={selectedMention}
                onChange={(e) => {
                  setSelectedMention(Number(e.target.value));
                  setSelectedParcours(0);
                  setFormData({ ...formData, idClasse: 0 });
                }}
                className={inputClass}
                required
                disabled={savingSeance}
              >
                <option value={0}>-- Sélectionner --</option>
                {meta.mentions.map((m) => (
                  <option key={m.idMention} value={m.idMention}>
                    {m.nomMention}
                  </option>
                ))}
              </select>
            </div>

            {/* Parcours */}
            <div>
              <label className={labelClass}>Parcours</label>
              <select
                value={selectedParcours}
                onChange={(e) => {
                  setSelectedParcours(Number(e.target.value));
                  setFormData({ ...formData, idClasse: 0 });
                }}
                className={inputClass}
                disabled={!selectedMention || savingSeance}
                required
              >
                <option value={0}>-- Sélectionner --</option>
                {parcoursFiltres.map((p) => (
                  <option key={p.idParcours} value={p.idParcours}>
                    {p.nomParcours}
                  </option>
                ))}
              </select>
            </div>

            {/* Classe */}
            <div>
              <label className={labelClass}>Niveau / Classe</label>
              <select
                value={formData.idClasse || ""}
                onChange={(e) =>
                  setFormData({ ...formData, idClasse: Number(e.target.value) })
                }
                className={inputClass}
                disabled={!selectedParcours || savingSeance}
                required
              >
                <option value="">-- Sélectionner --</option>
                {classesFiltrees.map((c) => (
                  <option key={c.idClasse} value={c.idClasse}>
                    {c.niveau}
                  </option>
                ))}
              </select>
            </div>

            {/* Jour */}
            <div>
              <label className={labelClass}>Jour</label>
              <select
                value={formData.jour}
                onChange={(e) =>
                  setFormData({ ...formData, jour: e.target.value })
                }
                className={inputClass}
                required
                disabled={savingSeance}
              >
                {JOURS.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            {/* Matière */}
            <div>
              <label className={labelClass}>Matière</label>
              <select
                value={formData.idMatiere || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    idMatiere: Number(e.target.value),
                  })
                }
                className={inputClass}
                required
                disabled={savingSeance}
              >
                <option value="">-- Sélectionner --</option>
                {meta.matieres.map((m) => (
                  <option key={m.idMatiere} value={m.idMatiere}>
                    {m.nomMatiere}
                  </option>
                ))}
              </select>
            </div>

            {/* Heures */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Début</label>
                <input
                  type="text"
                  value={formData.heureDebut}
                  onChange={(e) =>
                    setFormData({ ...formData, heureDebut: e.target.value })
                  }
                  className={inputClass}
                  placeholder="8h00"
                  required
                  disabled={savingSeance}
                />
              </div>
              <div>
                <label className={labelClass}>Fin</label>
                <input
                  type="text"
                  value={formData.heureFin}
                  onChange={(e) =>
                    setFormData({ ...formData, heureFin: e.target.value })
                  }
                  className={inputClass}
                  placeholder="10h00"
                  required
                  disabled={savingSeance}
                />
              </div>
            </div>

            {/* Salle */}
            <div>
              <label className={labelClass}>Salle</label>
              <select
                value={formData.idSalle || ""}
                onChange={(e) =>
                  setFormData({ ...formData, idSalle: Number(e.target.value) })
                }
                className={inputClass}
                required
                disabled={savingSeance}
              >
                <option value="">-- Sélectionner --</option>
                {meta.salles.map((s) => (
                  <option key={s.idSalle} value={s.idSalle}>
                    {s.nomSalle} ({s.capacite} places)
                  </option>
                ))}
              </select>
            </div>

            {/* Enseignant */}
            <div>
              <label className={labelClass}>Enseignant</label>
              <select
                value={formData.idEnseignant || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    idEnseignant: Number(e.target.value),
                  })
                }
                className={inputClass}
                required
                disabled={savingSeance}
              >
                <option value="">-- Sélectionner --</option>
                {meta.enseignants.map((ens) => (
                  <option key={ens.idEnseignant} value={ens.idEnseignant}>
                    {ens.civilite} {ens.nom}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={savingSeance}
              className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: emitNavy }}
            >
              {savingSeance ? (
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
                  {formData.idSeance > 0
                    ? "Enregistrement..."
                    : "Ajout en cours..."}
                </>
              ) : (
                <>
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
                      d={
                        formData.idSeance > 0
                          ? "M4.5 12.75l6 6 9-13.5"
                          : "M12 4.5v15m7.5-7.5h-15"
                      }
                    />
                  </svg>
                  {formData.idSeance > 0
                    ? "Enregistrer les modifications"
                    : "Ajouter la séance"}
                </>
              )}
            </button>

            {formData.idSeance > 0 && (
              <button
                type="button"
                onClick={clearForm}
                disabled={savingSeance}
                className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition disabled:opacity-50"
              >
                Annuler
              </button>
            )}
          </form>

          {/* ═══ GRILLE EDT ═══ */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-bold" style={{ color: emitNavy }}>
                  Grille Emploi du Temps
                </h2>
              </div>
              {filtreClasse && (
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: `${emitNavy}15`, color: emitNavy }}
                >
                  {meta.classes.find((c) => c.idClasse === Number(filtreClasse))?.niveau}
                </span>
              )}
            </div>

            {/* ── État vide : aucun filtre sélectionné ── */}
            {!filtreClasse ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${emitNavy}08` }}
                >
                  <svg
                    className="h-8 w-8"
                    style={{ color: `${emitNavy}40` }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                    />
                  </svg>
                </div>
                <h3
                  className="text-sm font-bold mb-1"
                  style={{ color: emitNavy }}
                >
                  Sélectionnez une classe
                </h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Utilisez les filtres Mention → Parcours → Niveau pour
                  afficher l'emploi du temps d'une classe.
                </p>
              </div>
            ) : nbSeancesVisibles === 0 ? (
              /* ── Filtre actif mais aucune séance ── */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${emitGold}15` }}
                >
                  <svg
                    className="h-8 w-8"
                    style={{ color: `${emitGold}60` }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </div>
                <h3
                  className="text-sm font-bold mb-1"
                  style={{ color: emitNavy }}
                >
                  Aucune séance
                </h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Cette classe n'a pas encore de séances programmées.
                  Utilisez le formulaire pour en ajouter.
                </p>
              </div>
            ) : (
              /* ── Grille normale ── */
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th
                      className="p-2 border border-slate-300 text-xs font-bold uppercase w-24"
                      style={{ background: emitNavy, color: "white" }}
                    >
                      Horaires
                    </th>
                    {JOURS.map((j) => (
                      <th
                        key={j}
                        className="p-2 border border-slate-300 text-xs font-bold uppercase"
                        style={{ background: emitNavy, color: "white" }}
                      >
                        {j}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    type CellInfo =
                      | { type: "seance"; seance: Seance; rowSpan: number }
                      | { type: "skip" }
                      | { type: "empty" };

                    const grille: CellInfo[][] = CRENEAUX.map(() =>
                      JOURS.map(() => ({ type: "empty" as const }))
                    );

                    seances.forEach((seance) => {
                      if (seance.idClasse !== Number(filtreClasse)) return;
                      const jourIdx = JOURS.findIndex(
                        (j) => j.toLowerCase() === seance.jour.toLowerCase()
                      );
                      if (jourIdx === -1) return;
                      const seanceDebut = heureEnMinutes(seance.heureDebut);
                      const seanceFin = heureEnMinutes(seance.heureFin);
                      let debutSlotIdx = -1,
                        finSlotIdx = -1;
                      CRENEAUX.forEach((slot, idx) => {
                        const { debut, fin } = parseSlot(slot);
                        if (seanceDebut >= debut && seanceDebut < fin)
                          debutSlotIdx = idx;
                        if (seanceDebut < fin && seanceFin > debut)
                          finSlotIdx = idx;
                      });
                      if (debutSlotIdx === -1) return;
                      const rowSpan = finSlotIdx - debutSlotIdx + 1;
                      if (grille[debutSlotIdx][jourIdx].type === "empty") {
                        grille[debutSlotIdx][jourIdx] = {
                          type: "seance",
                          seance,
                          rowSpan,
                        };
                        for (let i = 1; i < rowSpan; i++) {
                          if (debutSlotIdx + i < CRENEAUX.length)
                            grille[debutSlotIdx + i][jourIdx] = { type: "skip" };
                        }
                      }
                    });

                    return CRENEAUX.map((slot, creneauIdx) => (
                      <tr key={slot} className="h-16 text-center text-xs">
                        <td className="p-2 border border-slate-300 font-semibold bg-slate-50 text-slate-600 whitespace-nowrap">
                          {slot}
                        </td>
                        {JOURS.map((j, jourIdx) => {
                          const cell = grille[creneauIdx][jourIdx];
                          if (cell.type === "skip") return null;
                          if (cell.type === "empty") {
                            return (
                              <td
                                key={j}
                                className="p-1 border border-slate-300 align-middle"
                              >
                                <span className="text-slate-300">—</span>
                              </td>
                            );
                          }
                          const match = cell.seance;
                          return (
                            <td
                              key={j}
                              rowSpan={cell.rowSpan}
                              className="p-1 border border-slate-300 relative align-middle group"
                              style={{ height: `${cell.rowSpan * 4}rem` }}
                            >
                              <div
                                className="rounded h-full flex flex-col justify-center items-center shadow-sm p-2 relative"
                                style={{
                                  backgroundColor: match.matiere?.couleur,
                                }}
                                title={`${match.matiere?.nomMatiere} — ${match.heureDebut} à ${match.heureFin}`}
                              >
                                <div className="font-bold text-slate-900 text-[11px] leading-tight text-center">
                                  {match.matiere?.nomMatiere}
                                </div>
                                <div className="text-[10px] font-semibold text-slate-700 mt-1">
                                  {match.salle?.nomSalle}
                                </div>
                                <div className="italic text-slate-600 text-[10px] mt-0.5 text-center">
                                  {match.enseignant?.civilite}{" "}
                                  {match.enseignant?.nom}
                                </div>
                                <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition rounded">
                                  <div className="text-white text-[10px] font-semibold px-1 text-center leading-tight">
                                    {match.heureDebut} – {match.heureFin}
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleEditSeance(match)}
                                      className="bg-white text-slate-800 px-2 py-0.5 rounded font-semibold text-[10px] hover:bg-slate-100"
                                    >
                                      Modifier
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        demanderSuppression(match)
                                      }
                                      className="bg-red-600 text-white px-2 py-0.5 rounded font-semibold text-[10px] hover:bg-red-700"
                                    >
                                      Supprimer
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
