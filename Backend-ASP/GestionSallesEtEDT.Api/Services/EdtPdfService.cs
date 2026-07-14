using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using GestionSallesEtEDT.Api.Models;

namespace GestionSallesEtEDT.Api.Services
{
    public interface IEdtPdfService
    {
        byte[] GenererEdtPdf(EdtPdfData data);
    }

    public class EdtPdfData
    {
        public string AnneeUniversitaire { get; set; } = "2025-2026";
        public string Mention { get; set; } = "";
        public string Parcours { get; set; } = "";
        public string Niveau { get; set; } = "";
        public string SallePrincipale { get; set; } = "";
        public List<Seance> Seances { get; set; } = new();
    }

    public class EdtPdfService : IEdtPdfService
    {
        private static readonly string[] JOURS = { "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI" };

        private static readonly (string Label, int Debut, int Fin)[] CRENEAUX =
        {
            ("7h00- 8h00",   7*60,   8*60),
            ("8h00 -9h00",   8*60,   9*60),
            ("9h00 – 10h00", 9*60,  10*60),
            ("10h00 – 11h00",10*60, 11*60),
            ("11h00 – 12h00",11*60, 12*60),
            ("12h00 – 13h00",12*60, 13*60),
            ("13h00 – 14h00",13*60, 14*60),
            ("14h00 – 15h00",14*60, 15*60),
            ("15h00 -16h00", 15*60, 16*60),
            ("16h00 – 17h00",16*60, 17*60),
            ("17h00 – 18h00",17*60, 18*60),
        };

        // Types pour la grille
        private enum CellType { Empty, Seance, Skip }
        private class CellInfo
        {
            public CellType Type { get; set; } = CellType.Empty;
            public Seance? Seance { get; set; }
            public int RowSpan { get; set; } = 1;
        }

        public byte[] GenererEdtPdf(EdtPdfData data)
        {
            // ═══ Construire la grille avec rowspan ═══
            var grille = new CellInfo[CRENEAUX.Length, JOURS.Length];
            for (int i = 0; i < CRENEAUX.Length; i++)
                for (int j = 0; j < JOURS.Length; j++)
                    grille[i, j] = new CellInfo();

            foreach (var seance in data.Seances)
            {
                int jourIdx = -1;
                for (int j = 0; j < JOURS.Length; j++)
                    if (string.Equals(JOURS[j], seance.Jour, StringComparison.OrdinalIgnoreCase))
                        { jourIdx = j; break; }
                if (jourIdx == -1) continue;

                int sDebut = ConvertirEnMinutes(seance.HeureDebut);
                int sFin = ConvertirEnMinutes(seance.HeureFin);

                int debutSlotIdx = -1, finSlotIdx = -1;
                for (int i = 0; i < CRENEAUX.Length; i++)
                {
                    var (_, d, f) = CRENEAUX[i];
                    if (sDebut >= d && sDebut < f) debutSlotIdx = i;
                    if (sDebut < f && sFin > d) finSlotIdx = i;
                }

                if (debutSlotIdx == -1) continue;

                int rowSpan = finSlotIdx - debutSlotIdx + 1;

                if (grille[debutSlotIdx, jourIdx].Type == CellType.Empty)
                {
                    grille[debutSlotIdx, jourIdx] = new CellInfo
                    {
                        Type = CellType.Seance,
                        Seance = seance,
                        RowSpan = rowSpan
                    };
                    for (int k = 1; k < rowSpan; k++)
                        if (debutSlotIdx + k < CRENEAUX.Length)
                            grille[debutSlotIdx + k, jourIdx] = new CellInfo { Type = CellType.Skip };
                }
            }

            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(30);
                    page.DefaultTextStyle(x => x.FontFamily("Times New Roman").FontSize(10));

                    page.Content().Column(col =>
                    {
                        // ENTÊTE
                        col.Item().Row(row =>
                        {
                            row.RelativeItem(2).Column(c =>
                            {
                                c.Item().Text(t => { t.Span("MENTION : ").Bold(); t.Span(data.Mention); });
                                c.Item().PaddingTop(4).Text(t => { t.Span("PARCOURS : ").Bold(); t.Span(data.Parcours); });
                                c.Item().PaddingTop(4).Text(t => { t.Span("NIVEAU : ").Bold(); t.Span(data.Niveau); });
                            });
                            row.RelativeItem(3).AlignCenter().Column(c =>
                            {
                                c.Item().Text(t =>
                                {
                                    t.Span("ANNEE UNIVERSITAIRE : ").Bold();
                                    t.Span(data.AnneeUniversitaire).Bold();
                                });
                            });
                            row.RelativeItem(2).AlignRight().Column(c =>
                            {
                                c.Item().AlignRight().Background("#5DADE2").Padding(6).Text(t =>
                                {
                                    t.Span($"SALLE  {data.SallePrincipale}")
                                        .Bold().FontColor(Colors.White).FontSize(11);
                                });
                            });
                        });

                        col.Item().PaddingTop(15).AlignCenter().Text("EMPLOI DU TEMPS").Bold().FontSize(14);

                        // ═══ TABLE AVEC ROWSPAN ═══
                        col.Item().PaddingTop(10).Table(table =>
                        {
                            table.ColumnsDefinition(cols =>
                            {
                                cols.RelativeColumn(1.3f);
                                foreach (var _ in JOURS) cols.RelativeColumn(1.5f);
                            });

                            // Header
                            table.Header(header =>
                            {
                                header.Cell().Border(1).Padding(6).AlignCenter()
                                    .Text("HORAIRES").Bold().FontSize(10);
                                foreach (var jour in JOURS)
                                    header.Cell().Border(1).Padding(6).AlignCenter().Text(jour).Bold().FontSize(10);
                            });

                            // Corps
                            for (int i = 0; i < CRENEAUX.Length; i++)
                            {
                                // Colonne horaires
                                table.Cell().Border(1).Padding(6).AlignCenter().AlignMiddle()
                                    .Text(CRENEAUX[i].Label).FontSize(9);

                                for (int j = 0; j < JOURS.Length; j++)
                                {
                                    var cell = grille[i, j];

                                    if (cell.Type == CellType.Skip)
                                    {
                                        // Ne rien ajouter — la cellule au-dessus a un RowSpan
                                        continue;
                                    }

                                    if (cell.Type == CellType.Seance && cell.Seance != null)
                                    {
                                        var s = cell.Seance;
                                        var couleur = s.Matiere?.Couleur ?? "#FFFFFF";

                                        table.Cell()
                                            .RowSpan((uint)cell.RowSpan)
                                            .Border(1)
                                            .Background(couleur)
                                            .Padding(6)
                                            .AlignCenter()
                                            .AlignMiddle()
                                            .Column(cc =>
                                            {
                                                cc.Item().AlignCenter()
                                                    .Text(s.Matiere?.NomMatiere ?? "").Bold().FontSize(10);
                                                cc.Item().PaddingTop(4).AlignCenter()
                                                    .Text($"{s.Enseignant?.Civilite} {s.Enseignant?.Nom}")
                                                    .Italic().FontSize(9);
                                            });
                                    }
                                    else
                                    {
                                        table.Cell().Border(1).MinHeight(35);
                                    }
                                }
                            }
                        });
                    });
                });
            }).GeneratePdf();
        }

        private int ConvertirEnMinutes(string heure)
        {
            if (string.IsNullOrWhiteSpace(heure)) return -1;
            var normalisee = heure.Trim().ToLower().Replace("h", ":");
            var parts = normalisee.Split(':');
            if (parts.Length >= 1 && int.TryParse(parts[0], out var h))
            {
                var m = 0;
                if (parts.Length >= 2 && parts[1].Length > 0)
                    int.TryParse(parts[1], out m);
                return h * 60 + m;
            }
            return -1;
        }
    }
}