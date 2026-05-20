// pages/Salles.tsx
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  LinearProgress,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ComputerIcon from "@mui/icons-material/Computer";
import PeopleIcon from "@mui/icons-material/People";
import VideocamIcon from "@mui/icons-material/Videocam";


interface Salle {
  id: number;
  nom: string;
  type: "Cours" | "TP" | "Amphi" | "Laboratoire";
  capacite: number;
  equipements: string[];
  disponibilite: "Disponible" | "Occupée" | "Maintenance";
  etage: number;
}

export default function Salles() {
  const [salles, setSalles] = useState<Salle[]>([
    { id: 1, nom: "Salle 101", type: "Cours", capacite: 30, equipements: ["Tableau", "Vidéoprojecteur"], disponibilite: "Disponible", etage: 1 },
    { id: 2, nom: "Salle 102", type: "Cours", capacite: 25, equipements: ["Tableau"], disponibilite: "Occupée", etage: 1 },
    { id: 3, nom: "Labo Info", type: "TP", capacite: 20, equipements: ["Ordinateurs", "Vidéoprojecteur", "Internet"], disponibilite: "Disponible", etage: 2 },
    { id: 4, nom: "Amphi A", type: "Amphi", capacite: 150, equipements: ["Vidéoprojecteur", "Sonorisation"], disponibilite: "Disponible", etage: 0 },
    { id: 5, nom: "Labo Chimie", type: "Laboratoire", capacite: 15, equipements: ["Paillasses", "Hotline"], disponibilite: "Maintenance", etage: 2 },
    { id: 6, nom: "Salle 201", type: "Cours", capacite: 35, equipements: ["Tableau", "Vidéoprojecteur", "Climatisation"], disponibilite: "Disponible", etage: 2 },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSalle, setEditingSalle] = useState<Salle | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette salle ?")) {
      setSalles(salles.filter((s) => s.id !== id));
    }
  };

  const handleEdit = (salle: Salle) => {
    setEditingSalle(salle);
    setOpenDialog(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Cours":
        return <MeetingRoomIcon sx={{ color: "#020339", fontSize: 20 }} />;
      case "TP":
        return <ComputerIcon sx={{ color: "#94CCFB", fontSize: 20 }} />;
      case "Amphi":
        return <PeopleIcon sx={{ color: "#10b981", fontSize: 20 }} />;
      case "Laboratoire":
        return <VideocamIcon sx={{ color: "#f59e0b", fontSize: 20 }} />;
      default:
        return <MeetingRoomIcon sx={{ color: "#6b7280", fontSize: 20 }} />;
    }
  };

  const getDisponibiliteColor = (disponibilite: string) => {
    switch (disponibilite) {
      case "Disponible":
        return { bg: "#10b98120", color: "#10b981" };
      case "Occupée":
        return { bg: "#ef444420", color: "#ef4444" };
      case "Maintenance":
        return { bg: "#f59e0b20", color: "#f59e0b" };
      default:
        return { bg: "#6b728020", color: "#6b7280" };
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>

      <Box sx={{ flex: 1, ml: "280px" }}>
      
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#020339" }}>
                Salles
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
                Gérer les salles de l'établissement
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingSalle(null);
                setOpenDialog(true);
              }}
              sx={{
                bgcolor: "#020339",
                "&:hover": { bgcolor: "#020339CC" },
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
              }}
            >
              Ajouter une salle
            </Button>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, mb: 3 }}>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Total Salles</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#020339", mt: 1 }}>
                  {salles.length}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Capacité totale</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#94CCFB", mt: 1 }}>
                  {salles.reduce((sum, s) => sum + s.capacite, 0)}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Salles disponibles</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#10b981", mt: 1 }}>
                  {salles.filter(s => s.disponibilite === "Disponible").length}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Taux d'occupation</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f59e0b", mt: 1 }}>
                  {Math.round((salles.filter(s => s.disponibilite === "Occupée").length / salles.length) * 100)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(salles.filter(s => s.disponibilite === "Occupée").length / salles.length) * 100} 
                  sx={{ mt: 1, bgcolor: "#e5e7eb", "& .MuiLinearProgress-bar": { bgcolor: "#94CCFB" } }}
                />
              </CardContent>
            </Card>
          </Box>

          {/* Table */}
          <Card sx={{ borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)", border: "1px solid #f3f4f6" }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f9fafb" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Salle</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Capacité</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Équipements</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Étage</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Disponibilité</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "#6b7280" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salles.map((salle) => {
                      const disponibiliteColors = getDisponibiliteColor(salle.disponibilite);
                      return (
                        <TableRow key={salle.id} sx={{ "&:hover": { bgcolor: "#f9fafb" } }}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Box sx={{ width: 36, height: 36, bgcolor: "#94CCFB20", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <MeetingRoomIcon sx={{ color: "#020339", fontSize: 20 }} />
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: "#1f2937" }}>
                                {salle.nom}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {getTypeIcon(salle.type)}
                              <Typography variant="body2" sx={{ color: "#374151" }}>
                                {salle.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#374151" }}>
                              {salle.capacite} places
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                              {salle.equipements.map((equip, idx) => (
                                <Chip key={idx} label={equip} size="small" sx={{ bgcolor: "#f3f4f6", color: "#374151", fontSize: "0.7rem" }} />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#374151" }}>
                              Étage {salle.etage}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={salle.disponibilite}
                              size="small"
                              sx={{ bgcolor: disponibiliteColors.bg, color: disponibiliteColors.color, fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => handleEdit(salle)} sx={{ color: "#94CCFB" }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDelete(salle.id)} sx={{ color: "#ef4444" }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Dialog Form */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ color: "#020339", fontWeight: "bold" }}>
              {editingSalle ? "Modifier la salle" : "Ajouter une salle"}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                <TextField 
                  label="Nom de la salle" 
                  fullWidth 
                  size="small" 
                  defaultValue={editingSalle?.nom || ""}
                />
                <TextField
                  label="Type"
                  select
                  fullWidth
                  size="small"
                  defaultValue={editingSalle?.type || "Cours"}
                >
                  <MenuItem value="Cours">Cours</MenuItem>
                  <MenuItem value="TP">TP</MenuItem>
                  <MenuItem value="Amphi">Amphi</MenuItem>
                  <MenuItem value="Laboratoire">Laboratoire</MenuItem>
                </TextField>
                <TextField 
                  label="Capacité" 
                  type="number" 
                  fullWidth 
                  size="small" 
                  defaultValue={editingSalle?.capacite || ""}
                />
                <TextField 
                  label="Équipements (séparés par virgule)" 
                  fullWidth 
                  size="small" 
                  defaultValue={editingSalle?.equipements.join(", ") || ""}
                  helperText="Ex: Tableau, Vidéoprojecteur, Ordinateurs"
                />
                <TextField 
                  label="Étage" 
                  type="number" 
                  fullWidth 
                  size="small" 
                  defaultValue={editingSalle?.etage || ""}
                />
                <TextField
                  label="Disponibilité"
                  select
                  fullWidth
                  size="small"
                  defaultValue={editingSalle?.disponibilite || "Disponible"}
                >
                  <MenuItem value="Disponible">Disponible</MenuItem>
                  <MenuItem value="Occupée">Occupée</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                </TextField>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: "none", color: "#6b7280" }}>
                Annuler
              </Button>
              <Button
                onClick={() => {
                  setOpenDialog(false);
                  setEditingSalle(null);
                }}
                variant="contained"
                sx={{ bgcolor: "#020339", "&:hover": { bgcolor: "#020339CC" }, textTransform: "none" }}
              >
                Enregistrer
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}