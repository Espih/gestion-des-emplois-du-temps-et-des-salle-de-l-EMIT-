import { useState, useEffect, useCallback, useRef } from "react";

export interface Notification {
  id: number;
  message: string;
  detail: string;
  timestamp: Date;
  lu: boolean;
}

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

interface SalleOccupation {
  idSalle: number;
  nomSalle: string;
  occupations: {
    jour: string;
    heureDebut: string;
    heureFin: string;
  }[];
}

let _notifCounter = 0;

export function useNotifications(salles: SalleOccupation[]) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const previouslyOccupied = useRef<Set<number>>(new Set());

  const checkLiberations = useCallback(() => {
    const now = new Date();
    const jourActuel = now.getDay();
    const heureActuelle = now.getHours() * 60 + now.getMinutes();

    const currentlyOccupied = new Set<number>();

    salles.forEach((salle) => {
      const estOccupee = salle.occupations.some((occ) => {
        const jourSeance = JOURS_MAP[occ.jour.toLowerCase()];
        if (jourSeance !== jourActuel) return false;
        const debut = heureEnMinutes(occ.heureDebut);
        const fin = heureEnMinutes(occ.heureFin);
        return heureActuelle >= debut && heureActuelle < fin;
      });

      if (estOccupee) {
        currentlyOccupied.add(salle.idSalle);
      }
    });

    previouslyOccupied.current.forEach((idSalle) => {
      if (!currentlyOccupied.has(idSalle)) {
        const salle = salles.find((s) => s.idSalle === idSalle);
        if (salle) {
          const id = ++_notifCounter;
          setNotifications((prev) => [
            {
              id,
              message: `${salle.nomSalle} est maintenant libre`,
              detail: `Libérée à ${now.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}`,
              timestamp: now,
              lu: false,
            },
            ...prev,
          ]);
        }
      }
    });

    previouslyOccupied.current = currentlyOccupied;
  }, [salles]);

  useEffect(() => {
    checkLiberations();
    const timer = setInterval(checkLiberations, 30_000);
    return () => clearInterval(timer);
  }, [checkLiberations]);

  const marquerCommeLu = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lu: true } : n))
    );
  }, []);

  const marquerToutLu = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
  }, []);

  const supprimer = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const supprimerTout = useCallback(() => {
    setNotifications([]);
  }, []);

  const nbNonLues = notifications.filter((n) => !n.lu).length;

  return {
    notifications,
    nbNonLues,
    marquerCommeLu,
    marquerToutLu,
    supprimer,
    supprimerTout,
  };
}
