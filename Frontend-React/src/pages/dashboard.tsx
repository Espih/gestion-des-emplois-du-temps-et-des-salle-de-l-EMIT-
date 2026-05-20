import { Grid, Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import StatCard from "../components/Dashboard/statCard";
import Chart from "../components/Dashboard/Chart";
import RecentActivity from "../components/Dashboard/RecentActivity";
import RecentComments from "../components/Dashboard/RecentComments";

export default function Dashboard() {
  const chartData = {
    sales: [30, 45, 35, 50, 65, 70, 85, 90, 78, 88, 92, 95],
    revenue: [45, 55, 60, 70, 75, 85, 90, 95, 88, 92, 96, 98],
    profit: [20, 30, 35, 45, 55, 65, 70, 75, 68, 78, 82, 85],
  };

  const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Stats Cards - Correction: ajouter container et utiliser les props correctement */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Classes" value={12} icon={<DashboardIcon />} color="#020339" trend={12} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Enseignants" value={34} icon={<SchoolIcon />} color="#94CCFB" trend={8} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Matières" value={28} icon={<BookIcon />} color="#020339" trend={5} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Salles" value={15} icon={<MeetingRoomIcon />} color="#94CCFB" trend={0} />
        </Grid>

        {/* Chart */}
        <Grid size={{ xs: 12 }}>
          <Chart data={chartData} labels={chartLabels} />
        </Grid>

        {/* Recent Activity and Comments */}
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