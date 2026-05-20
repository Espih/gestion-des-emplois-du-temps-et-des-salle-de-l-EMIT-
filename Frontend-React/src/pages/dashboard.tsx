import { useState, useEffect } from "react";
import { Grid, Box, Typography, CircularProgress, Alert, Paper } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PieChartIcon from "@mui/icons-material/PieChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import StatCard from "../components/Dashboard/statCard";
import { classeService } from "../services/classeService";
import { enseignantService } from "../services/enseignantService";
import { matiereService } from "../services/matiereService";
import { salleService } from "../services/salleService";
import { Pie,Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import type { Classe } from "../models/classe";
import type { Enseignant } from "../models/enseignant";
import type { Matiere } from "../models/matiere";
import type { Salle } from "../models/salle";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard() {
  const [stats, setStats] = useState({
    classes: 0,
    enseignants: 0,
    matieres: 0,
    salles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [classesData, setClassesData] = useState<Classe[]>([]);
  const [enseignantsData, setEnseignantsData] = useState<Enseignant[]>([]);
  const [matieresData, setMatieresData] = useState<Matiere[]>([]);
  const [sallesData, setSallesData] = useState<Salle[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const [classes, enseignants, matieres, salles] = await Promise.all([
          classeService.getAll(),
          enseignantService.getAll(),
          matiereService.getAll(),
          salleService.getAll(),
        ]);

        setClassesData(classes);
        setEnseignantsData(enseignants);
        setMatieresData(matieres);
        setSallesData(salles);

        setStats({
          classes: classes.length,
          enseignants: enseignants.length,
          matieres: matieres.length,
          salles: salles.length,
        });
        setError("");
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Données répartition des classes par niveau)
  const niveaux = [...new Set(classesData.map(c => c.niveau_cli))];
  const pieChartData = {
    labels: niveaux,
    datasets: [
      {
        label: "Nombre de classes",
        data: niveaux.map(niveau => classesData.filter(c => c.niveau_cli === niveau).length),
        backgroundColor: ["#020339", "#94CCFB", "#10b981", "#f59e0b", "#ef4444"],
        borderColor: ["#020339", "#94CCFB", "#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { color: "#374151", font: { size: 12 } },
      },
    },
  };

  // Top 5 matières par coefficient
  const topMatieres = [...matieresData]
    .sort((a, b) => b.coefficient_matiere - a.coefficient_matiere)
    .slice(0, 5);

  const histogram1Data = {
    labels: topMatieres.map(m => m.libelle_matiere.length > 15 ? m.libelle_matiere.substring(0, 12) + "..." : m.libelle_matiere),
    datasets: [
      {
        label: "Coefficient",
        data: topMatieres.map(m => m.coefficient_matiere),
        backgroundColor: "#020339",
        borderRadius: 8,
      },
    ],
  };

  // Top 5 enseignants par nombre de matières
const topEnseignants = [...enseignantsData]
  .map(e => ({
    ...e,
    matieresCount: matieresData.filter((m: Matiere) => m.id_enseignant === e.id).length,
  }))
  .sort((a, b) => b.matieresCount - a.matieresCount)
  .slice(0, 5);

  const histogram2Data = {
    labels: topEnseignants.map(e => {
      const name = `${e.prenom_enseignant} ${e.nom_enseignant}`;
      return name.length > 15 ? name.substring(0, 12) + "..." : name;
    }),
    datasets: [
      {
        label: "Nombre de matières",
        data: topEnseignants.map(e => e.matieresCount),
        backgroundColor: "#94CCFB",
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const, labels: { color: "#374151" } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#6b7280", stepSize: 1 }, grid: { color: "#e5e7eb" } },
      x: { ticks: { color: "#6b7280" }, grid: { display: false } },
    },
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      {/* Titre */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#020339" }}>
          Tableau de bord
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
          Bienvenue sur votre espace d'administration
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Cartes statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Classes" value={stats.classes} icon={<DashboardIcon />} color="#020339" trend={12} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Enseignants" value={stats.enseignants} icon={<SchoolIcon />} color="#94CCFB" trend={8} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Matières" value={stats.matieres} icon={<BookIcon />} color="#020339" trend={5} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Salles" value={stats.salles} icon={<MeetingRoomIcon />} color="#94CCFB" trend={0} />
        </Grid>
      </Grid>

      {/* Graphique 1 - Barres horizontales pour la répartition des salles */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: "16px", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <BarChartIcon sx={{ color: "#020339" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#020339" }}>
                Répartition des types de salles
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {(() => {
                const types = ["Cours", "TP", "Amphi", "Laboratoire", "Examen"];
                const counts = types.map(type => sallesData.filter(s => s.type_salle === type).length);
                const total = sallesData.length;
                const colors = ["#020339", "#94CCFB", "#10b981", "#f59e0b", "#ef4444"];
                return types.map((type, index) => {
                  const percentage = total > 0 ? (counts[index] / total) * 100 : 0;
                  if (counts[index] === 0) return null;
                  return (
                    <Box key={type}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>{type}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: colors[index] }}>
                          {counts[index]} ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <Box sx={{ width: "100%", bgcolor: "#e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                        <Box sx={{ width: `${percentage}%`, bgcolor: colors[index], height: "8px", borderRadius: "8px" }} />
                      </Box>
                    </Box>
                  );
                });
              })()}
            </Box>
          </Paper>
        </Grid>

        {/* Graphique 2 - Pie Chart pour la répartition des classes par niveau */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: "16px", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PieChartIcon sx={{ color: "#020339" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#020339" }}>
                Répartition des classes par niveau
              </Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <Pie data={pieChartData} options={pieOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Graphique 3 - Histogramme 1 + Graphique 4 - Histogramme 2 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: "16px", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <BarChartIcon sx={{ color: "#020339" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#020339" }}>
                Top 5 des matières par coefficient
              </Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <Bar data={histogram1Data} options={barOptions} />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: "16px", height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <SchoolIcon sx={{ color: "#020339" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#020339" }}>
                Top 5 enseignants (nombre de matières)
              </Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <Bar data={histogram2Data} options={barOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Vue d'ensemble */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: "16px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#020339", mb: 2 }}>
              Vue d'ensemble
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "#02033910", borderRadius: "12px" }}>
                  <Typography variant="h3" sx={{ fontWeight: "bold", color: "#020339" }}>
                    {stats.classes}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Classes</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "#94CCFB20", borderRadius: "12px" }}>
                  <Typography variant="h3" sx={{ fontWeight: "bold", color: "#94CCFB" }}>
                    {stats.enseignants}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Enseignants</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "#10b98120", borderRadius: "12px" }}>
                  <Typography variant="h3" sx={{ fontWeight: "bold", color: "#10b981" }}>
                    {stats.matieres}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Matières</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "#f59e0b20", borderRadius: "12px" }}>
                  <Typography variant="h3" sx={{ fontWeight: "bold", color: "#f59e0b" }}>
                    {stats.salles}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Salles</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}