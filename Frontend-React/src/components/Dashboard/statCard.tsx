import { Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  trend?: number;
}

export default function StatCard({ title, value, icon, color = "#020339", trend }: StatCardProps) {
  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
        border: "1px solid #f3f4f6",
        transition: "all 0.3s",
        "&:hover": {
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              backgroundColor: `${color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: color,
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <TrendingUpIcon sx={{ color: "#10b981", fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: "#10b981" }}>
                +{trend}%
              </Typography>
            </Box>
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1f2937", mb: 1 }}>
          {value.toLocaleString()}
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}