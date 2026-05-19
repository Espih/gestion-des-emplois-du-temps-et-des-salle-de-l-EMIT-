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
  Avatar,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { enseignantService } from "../services/enseignantService";
import { matiereService } from "../services/matiereService";
import type { Enseignant, EnseignantWithRelations } from "../models/enseignant";
import type { Matiere } from "../models/matiere";

export default function Enseignants() {
  const [enseignants, setEnseignants] = useState<EnseignantWithRelations[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEnseignant, setEditingEnseignant] = useState<Enseignant | null>(null);
  const [formData, setFormData] = useState({
    nom_enseignant: "",
    prenom_enseignant: "",
    email_enseignant: "",
    telephone_enseignant: "",
  });

  // Appel API direct dans le useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [enseignantsData, matieresData] = await Promise.all([
          enseignantService.getAll(),
          matiereService.getAll(),
        ]);

        const enseignantsWithMatieres = enseignantsData.map(enseignant => ({
          ...enseignant,
          matieres: matieresData.filter(m => m.id === enseignant.id)
        }));
        
        setEnseignants(enseignantsWithMatieres);
        setMatieres(matieresData);
        setError("");
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [enseignantsData, matieresData] = await Promise.all([
        enseignantService.getAll(),
        matiereService.getAll(),
      ]);
      
      const enseignantsWithMatieres = enseignantsData.map(enseignant => ({
        ...enseignant,
        matieres: matieresData.filter(m => m.id === enseignant.id)
      }));
      
      setEnseignants(enseignantsWithMatieres);
      setMatieres(matieresData);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ?")) {
      try {
        await enseignantService.delete(id);
        await refreshData();
      } catch (err) {
        console.log("erreur :", err);
        
        setError("Erreur lors de la suppression");
      }
    }
  };

  const handleEdit = (enseignant: Enseignant) => {
    setEditingEnseignant(enseignant);
    setFormData({
      nom_enseignant: enseignant.nom_enseignant,
      prenom_enseignant: enseignant.prenom_enseignant,
      email_enseignant: enseignant.email_enseignant,
      telephone_enseignant: enseignant.telephone_enseignant,
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingEnseignant) {
        await enseignantService.update(editingEnseignant.id, formData);
      } else {
        await enseignantService.create(formData);
      }
      await refreshData();
      setOpenDialog(false);
      setEditingEnseignant(null);
      setFormData({
        nom_enseignant: "",
        prenom_enseignant: "",
        email_enseignant: "",
        telephone_enseignant: "",
    });
    } catch (err) {
       console.log("erreur :", err);
      setError("Erreur lors de l'enregistrement");
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
            Enseignants
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
            Gérer les enseignants de l'établissement
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingEnseignant(null);
            setFormData({
              nom_enseignant: "",
              prenom_enseignant: "",
              email_enseignant: "",
              telephone_enseignant: "",
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
          Ajouter un enseignant
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
              <Typography variant="body2" sx={{ color: "#6b7280" }}>Total Enseignants</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#020339", mt: 1 }}>
                {enseignants.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>Total Matières enseignées</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#94CCFB", mt: 1 }}>
                {matieres.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>Moyenne par enseignant</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#10b981", mt: 1 }}>
                {(matieres.length / enseignants.length || 0).toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>Taux d'occupation</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f59e0b", mt: 1 }}>
                {Math.round((enseignants.filter(e => e.matieres && e.matieres.length > 0).length / enseignants.length) * 100)}%
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
                  <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Enseignant</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Téléphone</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Matières enseignées</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "#6b7280" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enseignants.map((enseignant) => (
                  <TableRow key={enseignant.id} sx={{ "&:hover": { bgcolor: "#f9fafb" } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "#94CCFB", color: "#020339" }}>
                          {enseignant.prenom_enseignant[0]}{enseignant.nom_enseignant[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "#1f2937" }}>
                            {enseignant.prenom_enseignant} {enseignant.nom_enseignant}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                            ID: {enseignant.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <EmailIcon sx={{ color: "#9ca3af", fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: "#374151" }}>
                          {enseignant.email_enseignant}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PhoneIcon sx={{ color: "#9ca3af", fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: "#374151" }}>
                          {enseignant.telephone_enseignant}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {enseignant.matieres && enseignant.matieres.length > 0 ? (
                          enseignant.matieres.map((matiere) => (
                            <Chip
                              key={matiere.id_matiere}
                              label={matiere.libelle_matiere}
                              size="small"
                              sx={{ bgcolor: "#94CCFB20", color: "#020339", fontWeight: 500 }}
                            />
                          ))
                        ) : (
                          <Chip
                            label="Aucune matière"
                            size="small"
                            sx={{ bgcolor: "#f3f4f6", color: "#6b7280" }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Actif"
                        size="small"
                        sx={{ bgcolor: "#10b98120", color: "#10b981", fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(enseignant)} sx={{ color: "#94CCFB" }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(enseignant.id)} sx={{ color: "#ef4444" }}>
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
          {editingEnseignant ? "Modifier l'enseignant" : "Ajouter un enseignant"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Nom"
              fullWidth
              size="small"
              value={formData.nom_enseignant}
              onChange={(e) => setFormData({ ...formData, nom_enseignant: e.target.value })}
            />
            <TextField
              label="Prénom"
              fullWidth
              size="small"
              value={formData.prenom_enseignant}
              onChange={(e) => setFormData({ ...formData, prenom_enseignant: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              size="small"
              value={formData.email_enseignant}
              onChange={(e) => setFormData({ ...formData, email_enseignant: e.target.value })}
            />
            <TextField
              label="Téléphone"
              fullWidth
              size="small"
              value={formData.telephone_enseignant}
              onChange={(e) => setFormData({ ...formData, telephone_enseignant: e.target.value })}
            />
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