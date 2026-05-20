import { useState, useEffect } from "react";
import { Grid, Box, Typography, CircularProgress, Alert } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import StatCard from "../components/Dashboard/statCard";
import Chart from "../components/Dashboard/Chart";
import RecentActivity from "../components/Dashboard/RecentActivity";
import RecentComments from "../components/Dashboard/RecentComments";
import { classeService } from "../services/classeService";
import { enseignantService } from "../services/enseignantService";
import { matiereService } from "../services/matiereService";
import { salleService } from "../services/salleService";

export default function Dashboard() {
  const [stats, setStats] = useState({
    classes: 0,
    enseignants: 0,
    matieres: 0,
    salles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const chartData = {
    sales: [30, 45, 35, 50, 65, 70, 85, 90, 78, 88, 92, 95],
    revenue: [45, 55, 60, 70, 75, 85, 90, 95, 88, 92, 96, 98],
    profit: [20, 30, 35, 45, 55, 65, 70, 75, 68, 78, 82, 85],
  };

  const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Charger les données dynamiques depuis les APIs
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Appel aux vraies API
        const classes = await classeService.getAll();
        const enseignants = await enseignantService.getAll();
        const matieres = await matiereService.getAll();
        const salles = await salleService.getAll();

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Titre de la page */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#020339" }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
          Bienvenue sur votre espace d'administration
        </Typography>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Cartes statistiques dynamiques */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Total Classes" 
            value={stats.classes} 
            icon={<DashboardIcon />} 
            color="#020339" 
            trend={12} 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Enseignants" 
            value={stats.enseignants} 
            icon={<SchoolIcon />} 
            color="#94CCFB" 
            trend={8} 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Matières" 
            value={stats.matieres} 
            icon={<BookIcon />} 
            color="#020339" 
            trend={5} 
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard 
            title="Salles" 
            value={stats.salles} 
            icon={<MeetingRoomIcon />} 
            color="#94CCFB" 
            trend={0} 
          />
        </Grid>

        {/* Graphique */}
        <Grid size={{ xs: 12 }}>
          <Chart data={chartData} labels={chartLabels} />
        </Grid>

        {/* Activités récentes et commentaires */}
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentActivity />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentComments />
        </Grid>
      </Grid>
    </Box>
  );
}