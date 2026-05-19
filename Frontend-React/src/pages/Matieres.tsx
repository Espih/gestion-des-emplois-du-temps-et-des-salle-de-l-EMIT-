
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
  Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BookIcon from "@mui/icons-material/Book";
import AccessTimeIcon from "@mui/icons-material/AccessTime";


interface Matiere {
  id: number;
  nom: string;
  code: string;
  coefficient: number;
  heuresSemaine: number;
  enseignant: string;
  niveau: string;
}

export default function Matieres() {
  const [matieres, setMatieres] = useState<Matiere[]>([
    { id: 1, nom: "Mathématiques", code: "MATH101", coefficient: 5, heuresSemaine: 6, enseignant: "Jean Martin", niveau: "1ère Année" },
    { id: 2, nom: "Physique", code: "PHY101", coefficient: 4, heuresSemaine: 4, enseignant: "Sophie Bernard", niveau: "1ère Année" },
    { id: 3, nom: "Informatique", code: "INF101", coefficient: 6, heuresSemaine: 8, enseignant: "Thomas Dubois", niveau: "2ème Année" },
    { id: 4, nom: "Anglais", code: "ANG101", coefficient: 3, heuresSemaine: 3, enseignant: "Marie Petit", niveau: "1ère Année" },
    { id: 5, nom: "Histoire", code: "HIS101", coefficient: 3, heuresSemaine: 3, enseignant: "Nicolas Robert", niveau: "2ème Année" },
    { id: 6, nom: "Chimie", code: "CHI101", coefficient: 4, heuresSemaine: 4, enseignant: "Sophie Bernard", niveau: "2ème Année" },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState<Matiere | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) {
      setMatieres(matieres.filter((m) => m.id !== id));
    }
  };

  const handleEdit = (matiere: Matiere) => {
    setEditingMatiere(matiere);
    setOpenDialog(true);
  };

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

          {/* Stats Cards */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, mb: 3 }}>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Total Matières</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#020339", mt: 1 }}>
                  {matieres.length}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Heures/semaine totales</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#94CCFB", mt: 1 }}>
                  {matieres.reduce((sum, m) => sum + m.heuresSemaine, 0)}h
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Coefficient moyen</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#10b981", mt: 1 }}>
                  {(matieres.reduce((sum, m) => sum + m.coefficient, 0) / matieres.length).toFixed(1)}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Enseignants</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f59e0b", mt: 1 }}>
                  {new Set(matieres.map(m => m.enseignant)).size}
                </Typography>
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
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Matière</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Coefficient</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Heures/Semaine</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Enseignant</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Niveau</TableCell>
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
                              {matiere.nom}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={matiere.code} size="small" sx={{ bgcolor: "#02033910", color: "#020339", fontFamily: "monospace" }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#020339" }}>
                            {matiere.coefficient}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccessTimeIcon sx={{ color: "#9ca3af", fontSize: 16 }} />
                            <Typography variant="body2" sx={{ color: "#374151" }}>
                              {matiere.heuresSemaine}h
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#374151" }}>
                            {matiere.enseignant}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={matiere.niveau} size="small" sx={{ bgcolor: "#94CCFB20", color: "#020339" }} />
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
                <TextField label="Nom de la matière" fullWidth size="small" />
                <TextField label="Code" fullWidth size="small" />
                <TextField label="Coefficient" type="number" fullWidth size="small" />
                <TextField label="Heures par semaine" type="number" fullWidth size="small" />
                <TextField label="Enseignant" fullWidth size="small" />
                <TextField label="Niveau" fullWidth size="small" />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: "none", color: "#6b7280" }}>
                Annuler
              </Button>
              <Button
                onClick={() => {
                  setOpenDialog(false);
                  setEditingMatiere(null);
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