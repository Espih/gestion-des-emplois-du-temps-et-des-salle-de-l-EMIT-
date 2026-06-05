import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { seanceService } from "../services/seanceService";
import type { Seance } from "../models/seance";

export default function Calendrier() {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState<Seance>({
    jour: "Lundi",
    heure_debut: "",
    heure_fin: "",
    id_cla: 0,
    id_matiere: 0,
    id_salle: 0,
    id_enseignant: 0,
    id_semestre: 1,
  });

  useEffect(() => {
    loadSeances();
  }, []);

  const loadSeances = async () => {
    try {
      const data = await seanceService.getAll();
      setSeances(data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setForm({
      jour: "Lundi",
      heure_debut: "",
      heure_fin: "",
      id_cla: 0,
      id_matiere: 0,
      id_salle: 0,
      id_enseignant: 0,
      id_semestre: 1,
    });
  };

  const handleOpen = () => {
    resetForm();
    setEditId(null);
    setError("");
    setOpen(true);
  };

  const handleEdit = (seance: Seance) => {
    setForm(seance);
    setEditId(seance.id_seance ?? null);
    setOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Voulez-vous supprimer cette séance ?"
    );

    if (!confirmDelete) return;

    try {
      await seanceService.delete(id);
      loadSeances();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (
      !form.heure_debut ||
      !form.heure_fin ||
      form.id_cla === 0 ||
      form.id_matiere === 0 ||
      form.id_salle === 0 ||
      form.id_enseignant === 0
    ) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      if (editId) {
        await seanceService.update(editId, form);
      } else {
        await seanceService.create(form);
      }

      setOpen(false);
      loadSeances();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold">
        Calendrier Universitaire
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mt: 2, mb: 2 }}
        onClick={handleOpen}
      >
        Ajouter une séance
      </Button>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>Jour</TableCell>
              <TableCell>Début</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Classe</TableCell>
              <TableCell>Matière</TableCell>
              <TableCell>Salle</TableCell>
              <TableCell>Enseignant</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {seances.map((item) => (
              <TableRow key={item.id_seance}>
                <TableCell>{item.jour}</TableCell>
                <TableCell>{item.heure_debut}</TableCell>
                <TableCell>{item.heure_fin}</TableCell>
                <TableCell>{item.id_cla}</TableCell>
                <TableCell>{item.id_matiere}</TableCell>
                <TableCell>{item.id_salle}</TableCell>
                <TableCell>{item.id_enseignant}</TableCell>

                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(item)}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDelete(item.id_seance)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
      >
        <DialogTitle>
          {editId
            ? "Modifier Séance"
            : "Ajouter Séance"}
        </DialogTitle>

        <DialogContent>

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <TextField
            select
            fullWidth
            margin="dense"
            label="Jour"
            value={form.jour}
            onChange={(e) =>
              setForm({
                ...form,
                jour: e.target.value as Seance["jour"],
              })
            }
          >
            {[
              "Lundi",
              "Mardi",
              "Mercredi",
              "Jeudi",
              "Vendredi",
              "Samedi",
            ].map((jour) => (
              <MenuItem
                key={jour}
                value={jour}
              >
                {jour}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="time"
            margin="dense"
            label="Heure début"
            InputLabelProps={{ shrink: true }}
            value={form.heure_debut}
            onChange={(e) =>
              setForm({
                ...form,
                heure_debut: e.target.value,
              })
            }
          />

          <TextField
            fullWidth
            type="time"
            margin="dense"
            label="Heure fin"
            InputLabelProps={{ shrink: true }}
            value={form.heure_fin}
            onChange={(e) =>
              setForm({
                ...form,
                heure_fin: e.target.value,
              })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="ID Classe"
            type="number"
            value={form.id_cla}
            onChange={(e) =>
              setForm({
                ...form,
                id_cla: Number(e.target.value),
              })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="ID Matière"
            type="number"
            value={form.id_matiere}
            onChange={(e) =>
              setForm({
                ...form,
                id_matiere: Number(e.target.value),
              })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="ID Salle"
            type="number"
            value={form.id_salle}
            onChange={(e) =>
              setForm({
                ...form,
                id_salle: Number(e.target.value),
              })
            }
          />

          <TextField
            fullWidth
            margin="dense"
            label="ID Enseignant"
            type="number"
            value={form.id_enseignant}
            onChange={(e) =>
              setForm({
                ...form,
                id_enseignant: Number(
                  e.target.value
                ),
              })
            }
          />

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Annuler
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}