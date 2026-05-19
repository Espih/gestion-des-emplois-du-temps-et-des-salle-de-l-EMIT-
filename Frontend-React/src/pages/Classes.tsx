// pages/Classes.tsx (version corrigée)
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClassIcon from "@mui/icons-material/Class";
import { classeService } from "../services/classeService";
import type { Classe } from "../models/classe";


export default function Classes() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<Classe | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    students: 0,
    teacher: "",
  });

  // Déclarer loadClasses AVANT useEffect
  const loadClasses = async () => {
    try {
      setLoading(true);
      const data = await classeService.getAll();
      setClasses(data);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des classes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Maintenant useEffect peut utiliser loadClasses
  useEffect(() => {
    loadClasses();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette classe ?")) {
      try {
        await classeService.delete(id);
        await loadClasses();
      } catch (err) {
        setError("Erreur lors de la suppression");
      }
    }
  };

  const handleEdit = (classe: Classe) => {
    setEditingClass(classe);
    setFormData({
      name: classe.name,
      level: classe.level,
      students: classe.students,
      teacher: classe.teacher,
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingClass) {
        await classeService.update(editingClass.id, formData);
      } else {
        await classeService.create(formData);
      }
      await loadClasses();
      setOpenDialog(false);
      setEditingClass(null);
      setFormData({ name: "", level: "", students: 0, teacher: "" });
    } catch (err) {
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
    <Box>
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
            setFormData({ name: "", level: "", students: 0, teacher: "" });
            setOpenDialog(true);
          }}
          sx={{
            bgcolor: "#020339",
            "&:hover": { bgcolor: "#020339CC" },
            textTransform: "none",
            borderRadius: "8px",
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

      {/* Table */}
      <Card sx={{ borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)", border: "1px solid #f3f4f6" }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Niveau</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Élèves</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Enseignant</TableCell>
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
                          {classe.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={classe.level} size="small" sx={{ bgcolor: "#94CCFB20", color: "#020339" }} />
                    </TableCell>
                    <TableCell sx={{ color: "#374151" }}>{classe.students}</TableCell>
                    <TableCell sx={{ color: "#374151" }}>{classe.teacher}</TableCell>
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Niveau"
              fullWidth
              size="small"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            />
            <TextField
              label="Nombre d'élèves"
              type="number"
              fullWidth
              size="small"
              value={formData.students}
              onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) })}
            />
            <TextField
              label="Enseignant"
              fullWidth
              size="small"
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
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
  );
}