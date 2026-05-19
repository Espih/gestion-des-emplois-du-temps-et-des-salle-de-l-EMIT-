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
  CircularProgress,
  Alert,
  Grid,
  MenuItem, 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClassIcon from "@mui/icons-material/Class";
import { classeService } from "../services/classeService";
import { anneeUniversitaireService } from "../services/anneeUniversitaireService";
import type { Classe } from "../models/classe";
import type { AnneeUniversitaire } from "../models/anneeUniversitaire";
import { closeSwal, showConfirmDelete, showError, showLoading, showSuccess } from "../swal";

export default function Classes() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [annees, setAnnees] = useState<AnneeUniversitaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<Classe | null>(null);
  const [formData, setFormData] = useState({
    nom_cli: "",
    niveau_cli: "",
    id_annee: 0,
  });

  // Fonction pour charger les données
  const loadData = async () => {
    try {
      setLoading(true);
      const [classesData, anneesData] = await Promise.all([
        classeService.getAll(),
        anneeUniversitaireService.getAll(),
      ]);
      setClasses(classesData);
      setAnnees(anneesData);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des données");
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
    const confirmed = await showConfirmDelete("cette classe");
    
    if (confirmed) {
      await showLoading("Suppression en cours...");
      try {
        await classeService.delete(id);
        await loadData();
        await closeSwal();
        await showSuccess('Classe supprimée avec succès');
      } catch (err) {
        console.log("erreur :", err);
        await closeSwal();
        await showError('Impossible de supprimer cette classe');
        setError("Erreur lors de la suppression");
      }
    }
  };

  // Modification (ouvrir le formulaire)
  const handleEdit = (classe: Classe) => {
    setEditingClass(classe);
    setFormData({
      nom_cli: classe.nom_cli,
      niveau_cli: classe.niveau_cli,
      id_annee: classe.id_annee,
    });
    setOpenDialog(true);
  };

  // Enregistrement (ajout et modification)
  const handleSave = async () => {
    setOpenDialog(false);
    
    setTimeout(async () => {
      await showLoading(editingClass ? "Modification en cours..." : "Ajout en cours...");
      
      try {
        if (editingClass) {
          await classeService.update(editingClass.id, formData);
          await closeSwal();
          await showSuccess('Classe modifiée avec succès !');
        } else {
          await classeService.create(formData);
          await closeSwal();
          await showSuccess('Classe ajoutée avec succès !');
        }
        
        await loadData();
        setEditingClass(null);
        setFormData({
          nom_cli: "",
          niveau_cli: "",
          id_annee: 0,
        });
      } catch (err) {
        console.log("erreur :", err);
        await closeSwal();
        await showError("Erreur lors de l'enregistrement");
        setError("Erreur lors de l'enregistrement");
      }
    }, 150);
  };

  //le libellé de l'année universitaire
  const getAnneeLabel = (id_annee: number) => {
    const annee = annees.find(a => a.id === id_annee);
    if (annee) {
      return `${new Date(annee.dateDebut_annee).getFullYear()}-${new Date(annee.dateFin_annee).getFullYear()}`;
    }
    return "Non assignée";
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
                Classes
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
                Gérer les classes de l'établissement
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingClass(null);
                setFormData({
                  nom_cli: "",
                  niveau_cli: "",
                  id_annee: annees.length > 0 ? annees[0].id: 0,
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
              Ajouter une classe
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
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Total Classes</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#020339", mt: 1 }}>
                    {classes.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Années Universitaires</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#94CCFB", mt: 1 }}>
                    {annees.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Niveaux</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#10b981", mt: 1 }}>
                    {new Set(classes.map(c => c.niveau_cli)).size}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Classes par année</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f59e0b", mt: 1 }}>
                    {(classes.length / annees.length || 0).toFixed(1)}
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
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Nom</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Niveau</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Année Universitaire</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "#6b7280" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {classes.map((classe) => (
                      
                      <TableRow key={classe.id} sx={{ "&:hover": { bgcolor: "#f9fafb" } }}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <ClassIcon sx={{ color: "#94CCFB", fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500, color: "#1f2937" }}>
                              {classe.nom_cli}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={classe.niveau_cli} size="small" sx={{ bgcolor: "#94CCFB20", color: "#020339" }} />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getAnneeLabel(classe.id_annee)} 
                            size="small" 
                            sx={{ bgcolor: "#02033910", color: "#020339" }} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleEdit(classe)} sx={{ color: "#94CCFB" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(classe.id)} sx={{ color: "#ef4444" }}>
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
              {editingClass ? "Modifier la classe" : "Ajouter une classe"}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                <TextField
                  label="Nom de la classe"
                  fullWidth
                  size="small"
                  value={formData.nom_cli}
                  onChange={(e) => setFormData({ ...formData, nom_cli: e.target.value })}
                />
                <TextField
                  label="Niveau"
                  fullWidth
                  size="small"
                  value={formData.niveau_cli}
                  onChange={(e) => setFormData({ ...formData, niveau_cli: e.target.value })}
                />
            <TextField
                label="Année Universitaire"
                select
                fullWidth
                size="small"
                value={formData.id_annee}
                onChange={(e) => setFormData({ ...formData, id_annee: parseInt(e.target.value) })}
              >
                <MenuItem value={0}>Sélectionner une année</MenuItem>
                {annees.map((annee) => (
                  <MenuItem key={annee.id} value={annee.id}>
                    {new Date(annee.dateDebut_annee).getFullYear()} - {new Date(annee.dateFin_annee).getFullYear()}
                  </MenuItem>
                ))}
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