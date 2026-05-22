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
import BookIcon from "@mui/icons-material/Book";
import { matiereService } from "../services/matiereService";
import { enseignantService } from "../services/enseignantService";
import type { Matiere, MatiereWithRelations } from "../models/matiere";
import type { Enseignant } from "../models/enseignant";
import { closeSwal, showConfirmDelete, showError, showLoading, showSuccess } from "../swal";

export default function Matieres() {
  const [matieres, setMatieres] = useState<MatiereWithRelations[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState<Matiere | null>(null);
  const [formData, setFormData] = useState({
    code_matiere: "",
    libelle_matiere: "",
    coefficient_matiere: 0,
    id_enseignant: 0,
  });

  // Charger les données
  const loadData = async () => {
    try {
      setLoading(true);
      const [matieresData, enseignantsData] = await Promise.all([
        matiereService.getAll(),
        enseignantService.getAll(),
      ]);
      
      // Enrichir les matières avec les enseignants
      const matieresWithEnseignants = matieresData.map(matiere => ({
        ...matiere,
        enseignant: enseignantsData.find(e => e.id === matiere.id)
      }));
      
      setMatieres(matieresWithEnseignants);
      setEnseignants(enseignantsData);
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
    const confirmed = await showConfirmDelete("cette matière");
    
    if (confirmed) {
      await showLoading("Suppression en cours...");
      try {
        await matiereService.delete(id);
        await loadData();
        await closeSwal();
        await showSuccess('Matière supprimée avec succès');
      } catch (err) {
        console.log("erreur :", err);
        await closeSwal();
        await showError('Impossible de supprimer cette matière');
        setError("Erreur lors de la suppression");
      }
    }
  };

  // Modification (ouvrir le formulaire)
  const handleEdit = (matiere: Matiere) => {
    setEditingMatiere(matiere);
    setFormData({
      code_matiere: matiere.code_matiere,
      libelle_matiere: matiere.libelle_matiere,
      coefficient_matiere: matiere.coefficient_matiere,
      id_enseignant: matiere.id,
    });
    setOpenDialog(true);
  };

  // Enregistrement (ajout et modification)
  const handleSave = async () => {
    setOpenDialog(false);
    
    setTimeout(async () => {
      await showLoading(editingMatiere ? "Modification en cours..." : "Ajout en cours...");
      
      try {
        if (editingMatiere) {
          await matiereService.update(editingMatiere.id, formData);
          await closeSwal();
          await showSuccess('Matière modifiée avec succès !');
        } else {
          await matiereService.create(formData);
          await closeSwal();
          await showSuccess('Matière ajoutée avec succès !');
        }
        
        await loadData();
        setEditingMatiere(null);
        setFormData({
          code_matiere: "",
          libelle_matiere: "",
          coefficient_matiere: 0,
          id_enseignant: 0,
        });
      } catch (err) {
        console.log("erreur :", err);
        await closeSwal();
        await showError("Erreur lors de l'enregistrement");
        setError("Erreur lors de l'enregistrement");
      }
    }, 150);
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
                Matières
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
                Gérer les matières de l'établissement
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingMatiere(null);
                setFormData({
                  code_matiere: "",
                  libelle_matiere: "",
                  coefficient_matiere: 0,
                  id_enseignant: 0,
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
              Ajouter une matière
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
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Total Matières</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#020339", mt: 1 }}>
                    {matieres.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Total Enseignants</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#94CCFB", mt: 1 }}>
                    {enseignants.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Coefficient moyen</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#10b981", mt: 1 }}>
                    {(matieres.reduce((sum, m) => sum + m.coefficient_matiere, 0) / matieres.length || 0).toFixed(1)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>Matières par enseignant</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f59e0b", mt: 1 }}>
                    {(matieres.length / enseignants.length || 0).toFixed(1)}
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
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Matière</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Coefficient</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Enseignant</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "#6b7280" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {matieres.map((matiere) => (
                      <TableRow key={matiere.id} sx={{ "&:hover": { bgcolor: "#f9fafb" } }}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box sx={{ width: 36, height: 36, bgcolor: "#94CCFB20", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <BookIcon sx={{ color: "#020339", fontSize: 20 }} />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: "#1f2937" }}>
                              {matiere.libelle_matiere}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={matiere.code_matiere} size="small" sx={{ bgcolor: "#02033910", color: "#020339", fontFamily: "monospace" }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#020339" }}>
                            {matiere.coefficient_matiere}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#374151" }}>
                            {matiere.enseignant ? `${matiere.enseignant.prenom_enseignant} ${matiere.enseignant.nom_enseignant}` : "Non assigné"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleEdit(matiere)} sx={{ color: "#94CCFB" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(matiere.id)} sx={{ color: "#ef4444" }}>
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
              {editingMatiere ? "Modifier la matière" : "Ajouter une matière"}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                <TextField
                  label="Nom de la matière"
                  fullWidth
                  size="small"
                  value={formData.libelle_matiere}
                  onChange={(e) => setFormData({ ...formData, libelle_matiere: e.target.value })}
                />
                <TextField
                  label="Code"
                  fullWidth
                  size="small"
                  value={formData.code_matiere}
                  onChange={(e) => setFormData({ ...formData, code_matiere: e.target.value })}
                />
                <TextField
                  label="Coefficient"
                  type="number"
                  fullWidth
                  size="small"
                  value={formData.coefficient_matiere}
                  onChange={(e) => setFormData({ ...formData, coefficient_matiere: parseInt(e.target.value) })}
                />
                <TextField
                  label="Enseignant"
                  select
                  fullWidth
                  size="small"
                  value={formData.id_enseignant}
                  onChange={(e) => setFormData({ ...formData, id_enseignant: parseInt(e.target.value) })}
                >
                  <MenuItem value={0}>Sélectionner un enseignant</MenuItem>
                  {enseignants.map((enseignant) => (
                    <MenuItem key={enseignant.id} value={enseignant.id}>
                      {enseignant.prenom_enseignant} {enseignant.nom_enseignant}
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