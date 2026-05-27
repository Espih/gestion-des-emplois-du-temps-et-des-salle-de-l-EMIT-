import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Emploi {
  heure: string;
  lundi: string;
  mardi: string;
  mercredi: string;
  jeudi: string;
  vendredi: string;
}

export default function Calendrier() {
  const [emplois, setEmplois] = useState<Emploi[]>([
    {
      heure: "08:00 - 10:00",
      lundi: "Math",
      mardi: "Physique",
      mercredi: "Info",
      jeudi: "Anglais",
      vendredi: "BD",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [newCours, setNewCours] = useState<Emploi>({
    heure: "",
    lundi: "",
    mardi: "",
    mercredi: "",
    jeudi: "",
    vendredi: "",
  });

  // ✅ SAVE (ADD + EDIT)
  const handleSaveCours = () => {
    if (
      !newCours.heure ||
      !newCours.lundi ||
      !newCours.mardi ||
      !newCours.mercredi ||
      !newCours.jeudi ||
      !newCours.vendredi
    ) {
      setError("Fenoy daholo ny champs rehetra");
      return;
    }

    setError("");

    if (editIndex !== null) {
      const updated = [...emplois];
      updated[editIndex] = newCours;
      setEmplois(updated);
      setEditIndex(null);
    } else {
      setEmplois([...emplois, newCours]);
    }

    setNewCours({
      heure: "",
      lundi: "",
      mardi: "",
      mercredi: "",
      jeudi: "",
      vendredi: "",
    });

    setOpen(false);
  };

  const handleEdit = (index: number) => {
    setNewCours(emplois[index]);
    setEditIndex(index);
    setError("");
    setOpen(true);
  };

  const handleDelete = (index: number) => {
    setEmplois(emplois.filter((_, i) => i !== index));
  };

  const handleOpen = () => {
    setEditIndex(null);
    setError("");
    setNewCours({
      heure: "",
      lundi: "",
      mardi: "",
      mercredi: "",
      jeudi: "",
      vendredi: "",
    });
    setOpen(true);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" fontWeight="bold">
        Emploi du Temps
      </Typography>

      <Button onClick={handleOpen} startIcon={<AddIcon />} sx={{ mt: 2 }}>
        Ajouter
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Heure</TableCell>
              <TableCell>Lundi</TableCell>
              <TableCell>Mardi</TableCell>
              <TableCell>Mercredi</TableCell>
              <TableCell>Jeudi</TableCell>
              <TableCell>Vendredi</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {emplois.map((e, i) => (
              <TableRow key={i}>
                <TableCell>{e.heure}</TableCell>
                <TableCell><Chip label={e.lundi} /></TableCell>
                <TableCell><Chip label={e.mardi} /></TableCell>
                <TableCell><Chip label={e.mercredi} /></TableCell>
                <TableCell><Chip label={e.jeudi} /></TableCell>
                <TableCell><Chip label={e.vendredi} /></TableCell>

                <TableCell>
                  <IconButton onClick={() => handleEdit(i)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(i)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editIndex !== null ? "Modifier cours" : "Ajouter cours"}
        </DialogTitle>

        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Heure"
            fullWidth
            margin="dense"
            value={newCours.heure}
            onChange={(e) =>
              setNewCours({ ...newCours, heure: e.target.value })
            }
          />

          <TextField
            label="Lundi"
            fullWidth
            margin="dense"
            value={newCours.lundi}
            onChange={(e) =>
              setNewCours({ ...newCours, lundi: e.target.value })
            }
          />

          <TextField
            label="Mardi"
            fullWidth
            margin="dense"
            value={newCours.mardi}
            onChange={(e) =>
              setNewCours({ ...newCours, mardi: e.target.value })
            }
          />

          <TextField
            label="Mercredi"
            fullWidth
            margin="dense"
            value={newCours.mercredi}
            onChange={(e) =>
              setNewCours({ ...newCours, mercredi: e.target.value })
            }
          />

          <TextField
            label="Jeudi"
            fullWidth
            margin="dense"
            value={newCours.jeudi}
            onChange={(e) =>
              setNewCours({ ...newCours, jeudi: e.target.value })
            }
          />

          <TextField
            label="Vendredi"
            fullWidth
            margin="dense"
            value={newCours.vendredi}
            onChange={(e) =>
              setNewCours({ ...newCours, vendredi: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSaveCours}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}