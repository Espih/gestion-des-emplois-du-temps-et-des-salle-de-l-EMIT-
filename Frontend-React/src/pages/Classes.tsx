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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClassIcon from "@mui/icons-material/Class";

interface Class {
  id: number;
  name: string;
  level: string;
  students: number;
  teacher: string;
}

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([
    { id: 1, name: "Classe A", level: "1ère Année", students: 25, teacher: "M. Martin" },
    { id: 2, name: "Classe B", level: "2ème Année", students: 28, teacher: "Mme. Bernard" },
    { id: 3, name: "Classe C", level: "3ème Année", students: 30, teacher: "M. Dubois" },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette classe ?")) {
      setClasses(classes.filter((c) => c.id !== id));
    }
  };

  const handleEdit = (classe: Class) => {
    setEditingClass(classe);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editingClass) {
      setClasses(classes.map((c) => (c.id === editingClass.id ? editingClass : c)));
    } else {
      const newClass = {
        id: classes.length + 1,
        name: "Nouvelle Classe",
        level: "Niveau",
        students: 0,
        teacher: "Enseignant",
      };
      setClasses([...classes, newClass]);
    }
    setOpenDialog(false);
    setEditingClass(null);
  };

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
            setOpenDialog(true);
          }}
          sx={{
            bgcolor: "#020339",
            "&:hover": { bgcolor: "#020339/90" },
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Ajouter une classe
        </Button>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)", border: "1px solid #f3f4f6" }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell sx={{ fontWeight: "semibold", color: "#6b7280" }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: "semibold", color: "#6b7280" }}>Niveau</TableCell>
                  <TableCell sx={{ fontWeight: "semibold", color: "#6b7280" }}>Élèves</TableCell>
                  <TableCell sx={{ fontWeight: "semibold", color: "#6b7280" }}>Enseignant</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "semibold", color: "#6b7280" }}>
                    Actions
                  </TableCell>
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
            <TextField label="Nom de la classe" fullWidth size="small" />
            <TextField label="Niveau" fullWidth size="small" />
            <TextField label="Nombre d'élèves" type="number" fullWidth size="small" />
            <TextField label="Enseignant" fullWidth size="small" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: "none", color: "#6b7280" }}>
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ bgcolor: "#020339", "&:hover": { bgcolor: "#020339/90" }, textTransform: "none" }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}