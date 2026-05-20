
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
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";


interface Enseignant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  matiere: string;
  statut: "Permanent" | "Vacataire" | "Stagiaire";
}

export default function Enseignants() {
  const [enseignants, setEnseignants] = useState<Enseignant[]>([
    {
      id: 1,
      nom: "Martin",
      prenom: "Jean",
      email: "jean.martin@emit.com",
      telephone: "06 12 34 56 78",
      matiere: "Mathématiques",
      statut: "Permanent",
    },
    {
      id: 2,
      nom: "Bernard",
      prenom: "Sophie",
      email: "sophie.bernard@emit.com",
      telephone: "06 23 45 67 89",
      matiere: "Physique",
      statut: "Permanent",
    },
    {
      id: 3,
      nom: "Dubois",
      prenom: "Thomas",
      email: "thomas.dubois@emit.com",
      telephone: "06 34 56 78 90",
      matiere: "Informatique",
      statut: "Vacataire",
    },
    {
      id: 4,
      nom: "Petit",
      prenom: "Marie",
      email: "marie.petit@emit.com",
      telephone: "06 45 67 89 01",
      matiere: "Anglais",
      statut: "Permanent",
    },
    {
      id: 5,
      nom: "Robert",
      prenom: "Nicolas",
      email: "nicolas.robert@emit.com",
      telephone: "06 56 78 90 12",
      matiere: "Histoire",
      statut: "Stagiaire",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingEnseignant, setEditingEnseignant] = useState<Enseignant | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ?")) {
      setEnseignants(enseignants.filter((e) => e.id !== id));
    }
  };

  const handleEdit = (enseignant: Enseignant) => {
    setEditingEnseignant(enseignant);
    setOpenDialog(true);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Permanent":
        return { bg: "#10b98120", color: "#10b981" };
      case "Vacataire":
        return { bg: "#94CCFB20", color: "#94CCFB" };
      case "Stagiaire":
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
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Matière</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>Statut</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "#6b7280" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {enseignants.map((enseignant) => {
                      const statutColors = getStatutColor(enseignant.statut);
                      return (
                        <TableRow key={enseignant.id} sx={{ "&:hover": { bgcolor: "#f9fafb" } }}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Avatar sx={{ bgcolor: "#94CCFB", color: "#020339" }}>
                                {enseignant.prenom[0]}{enseignant.nom[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: "#1f2937" }}>
                                  {enseignant.prenom} {enseignant.nom}
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
                                {enseignant.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <PhoneIcon sx={{ color: "#9ca3af", fontSize: 16 }} />
                              <Typography variant="body2" sx={{ color: "#374151" }}>
                                {enseignant.telephone}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={enseignant.matiere}
                              size="small"
                              sx={{ bgcolor: "#94CCFB20", color: "#020339", fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={enseignant.statut}
                              size="small"
                              sx={{ bgcolor: statutColors.bg, color: statutColors.color, fontWeight: 500 }}
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
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, mt: 3 }}>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Total Enseignants</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#020339", mt: 1 }}>
                  {enseignants.length}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Permanents</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#10b981", mt: 1 }}>
                  {enseignants.filter(e => e.statut === "Permanent").length}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Vacataires</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#94CCFB", mt: 1 }}>
                  {enseignants.filter(e => e.statut === "Vacataire").length}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Stagiaires</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f59e0b", mt: 1 }}>
                  {enseignants.filter(e => e.statut === "Stagiaire").length}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Dialog Form */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ color: "#020339", fontWeight: "bold" }}>
              {editingEnseignant ? "Modifier l'enseignant" : "Ajouter un enseignant"}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                <TextField label="Nom" fullWidth size="small" />
                <TextField label="Prénom" fullWidth size="small" />
                <TextField label="Email" type="email" fullWidth size="small" />
                <TextField label="Téléphone" fullWidth size="small" />
                <TextField label="Matière" fullWidth size="small" />
               <TextField
                    label="Statut"
                    select
                    fullWidth
                    size="small"
                    value="Permanent"
                    onChange={() => {}}
                    >
                  <option value="Permanent">Permanent</option>
                  <option value="Vacataire">Vacataire</option>
                  <option value="Stagiaire">Stagiaire</option>
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
                  setEditingEnseignant(null);
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