import { useState, useEffect } from "react";
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
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ComputerIcon from "@mui/icons-material/Computer";
import PeopleIcon from "@mui/icons-material/People";
import VideocamIcon from "@mui/icons-material/Videocam";
import { salleService } from "../services/salleService";
import type { Salle } from "../models/salle";
import { closeSwal, showConfirmDelete, showError, showLoading, showSuccess } from "../swal";

export default function Salles() {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSalle, setEditingSalle] = useState<Salle | null>(null);
  const [formData, setFormData] = useState({
    code_salle: "",
    type_salle: "Cours" as Salle["type_salle"],
  });

  // Charger les données
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await salleService.getAll();
      setSalles(data);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des salles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, []);

  // Suppression
  const handleDelete = async (id: number) => {
    const confirmed = await showConfirmDelete("cette salle");
    
    if (confirmed) {
      await showLoading("Suppression en cours...");
      try {
        await salleService.delete(id);
        await loadData();
        await closeSwal();
        await showSuccess('Salle supprimée avec succès');
      } catch (err) {
        console.log("erreur :", err);
        await closeSwal();
        await showError('Impossible de supprimer cette salle');
        setError("Erreur lors de la suppression");
      }
    }
  };

  // Modification (ouvrir le formulaire)
  const handleEdit = (salle: Salle) => {
    setEditingSalle(salle);
    setFormData({
      code_salle: salle.code_salle,
      type_salle: salle.type_salle,
    });
    setOpenDialog(true);
  };

  // Enregistrement (ajout et modification)
  const handleSave = async () => {
    setOpenDialog(false);
    
    setTimeout(async () => {
      await showLoading(editingSalle ? "Modification en cours..." : "Ajout en cours...");
      
      try {
        if (editingSalle) {
          await salleService.update(editingSalle.id, formData);
          await closeSwal();
          await showSuccess('Salle modifiée avec succès !');
        } else {
          await salleService.create(formData);
          await closeSwal();
          await showSuccess('Salle ajoutée avec succès !');
        }
        
        await loadData();
        setEditingSalle(null);
        setFormData({
          code_salle: "",
          type_salle: "Cours",
        });
      } catch (err) {
        console.log("erreur :", err);
        await closeSwal();
        await showError("Erreur lors de l'enregistrement");
        setError("Erreur lors de l'enregistrement");
      }
    }, 150);
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>
      <Box sx={{ flex: 1 }}>
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
                setFormData({
                  code_salle: "",
                  type_salle: "Cours",
                });
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

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Statistiques */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Total Salles</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#020339", mt: 1 }}>
                    {salles.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Types de salles</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#94CCFB", mt: 1 }}>
                    {new Set(salles.map(s => s.type_salle)).size}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Salles de Cours</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#10b981", mt: 1 }}>
                    {salles.filter(s => s.type_salle === "Cours").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>TP / Laboratoires</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f59e0b", mt: 1 }}>
                    {salles.filter(s => s.type_salle === "TP" || s.type_salle === "Laboratoire").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Table */}
          <Card sx={{ borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)", border: "1px solid #f3f4f6" }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f9fafb" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Code Salle</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Type</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "#6b7280" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salles.map((salle) => (
                      <TableRow key={salle.id} sx={{ "&:hover": { bgcolor: "#f9fafb" } }}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box sx={{ width: 36, height: 36, bgcolor: "#94CCFB20", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <MeetingRoomIcon sx={{ color: "#020339", fontSize: 20 }} />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: "#1f2937" }}>
                              {salle.code_salle}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {getTypeIcon(salle.type_salle)}
                            <Chip 
                              label={salle.type_salle} 
                              size="small" 
                              sx={{ bgcolor: "#94CCFB20", color: "#020339" }} 
                            />
                          </Box>
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
                    ))}
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
                  label="Code de la salle"
                  fullWidth
                  size="small"
                  value={formData.code_salle}
                  onChange={(e) => setFormData({ ...formData, code_salle: e.target.value })}
                  placeholder="Ex: S101, LaboInfo, AmphiA"
                />
                <TextField
                  label="Type de salle"
                  select
                  fullWidth
                  size="small"
                  value={formData.type_salle}
                  onChange={(e) => setFormData({ ...formData,  type_salle: e.target.value as Salle["type_salle"] })}
                >
                  <MenuItem value="Cours">Cours</MenuItem>
                  <MenuItem value="TP">TP</MenuItem>
                  <MenuItem value="Amphi">Amphi</MenuItem>
                  <MenuItem value="Laboratoire">Laboratoire</MenuItem>
                  <MenuItem value="Examen">Examen</MenuItem>
                </TextField>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: "none", color: "#6b7280" }}>
                Annuler
              </Button>
              <Button
                onClick={handleSave}
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