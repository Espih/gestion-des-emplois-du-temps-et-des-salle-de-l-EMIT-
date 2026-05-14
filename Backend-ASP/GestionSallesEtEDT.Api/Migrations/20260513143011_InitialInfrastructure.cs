using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GestionSallesEtEDT.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialInfrastructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "classes",
                columns: table => new
                {
                    id_cla = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom_cla = table.Column<string>(type: "text", nullable: false),
                    niveau_cla = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_classes", x => x.id_cla);
                });

            migrationBuilder.CreateTable(
                name: "emplois_du_temps",
                columns: table => new
                {
                    id_edt = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    dateCreation_edt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    id_utilisateur = table.Column<int>(type: "integer", nullable: false),
                    id_cla = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_emplois_du_temps", x => x.id_edt);
                });

            migrationBuilder.CreateTable(
                name: "matieres",
                columns: table => new
                {
                    id_matiere = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code_matiere = table.Column<string>(type: "text", nullable: false),
                    libelle_matiere = table.Column<string>(type: "text", nullable: false),
                    coefficient_matiere = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_matieres", x => x.id_matiere);
                });

            migrationBuilder.CreateTable(
                name: "salles",
                columns: table => new
                {
                    id_salle = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code_salle = table.Column<string>(type: "text", nullable: false),
                    type_salle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_salles", x => x.id_salle);
                });

            migrationBuilder.CreateTable(
                name: "utilisateurs",
                columns: table => new
                {
                    id_utilisateur = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom_uti = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    prenom_uti = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email_uti = table.Column<string>(type: "text", nullable: false),
                    mdp_uti = table.Column<string>(type: "text", nullable: false),
                    role_uti = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_utilisateurs", x => x.id_utilisateur);
                });

            migrationBuilder.CreateTable(
                name: "enseignants",
                columns: table => new
                {
                    id_ensei = table.Column<int>(type: "integer", nullable: false),
                    telephone_ensei = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_enseignants", x => x.id_ensei);
                    table.ForeignKey(
                        name: "FK_enseignants_utilisateurs_id_ensei",
                        column: x => x.id_ensei,
                        principalTable: "utilisateurs",
                        principalColumn: "id_utilisateur",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "etudiants",
                columns: table => new
                {
                    id_etudiant = table.Column<int>(type: "integer", nullable: false),
                    matricule_etu = table.Column<string>(type: "text", nullable: false),
                    id_cla = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_etudiants", x => x.id_etudiant);
                    table.ForeignKey(
                        name: "FK_etudiants_classes_id_cla",
                        column: x => x.id_cla,
                        principalTable: "classes",
                        principalColumn: "id_cla",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_etudiants_utilisateurs_id_etudiant",
                        column: x => x.id_etudiant,
                        principalTable: "utilisateurs",
                        principalColumn: "id_utilisateur",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "seances",
                columns: table => new
                {
                    id_seance = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    jour_seance = table.Column<string>(type: "text", nullable: false),
                    heureDebut_seance = table.Column<TimeSpan>(type: "interval", nullable: false),
                    heureFin_seance = table.Column<TimeSpan>(type: "interval", nullable: false),
                    IdEdt = table.Column<int>(type: "integer", nullable: false),
                    IdSalle = table.Column<int>(type: "integer", nullable: false),
                    IdEnsei = table.Column<int>(type: "integer", nullable: false),
                    IdMatiere = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_seances", x => x.id_seance);
                    table.ForeignKey(
                        name: "FK_seances_emplois_du_temps_IdEdt",
                        column: x => x.IdEdt,
                        principalTable: "emplois_du_temps",
                        principalColumn: "id_edt",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_seances_enseignants_IdEnsei",
                        column: x => x.IdEnsei,
                        principalTable: "enseignants",
                        principalColumn: "id_ensei",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_seances_matieres_IdMatiere",
                        column: x => x.IdMatiere,
                        principalTable: "matieres",
                        principalColumn: "id_matiere",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_seances_salles_IdSalle",
                        column: x => x.IdSalle,
                        principalTable: "salles",
                        principalColumn: "id_salle",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_etudiants_id_cla",
                table: "etudiants",
                column: "id_cla");

            migrationBuilder.CreateIndex(
                name: "IX_seances_IdEdt",
                table: "seances",
                column: "IdEdt");

            migrationBuilder.CreateIndex(
                name: "IX_seances_IdEnsei",
                table: "seances",
                column: "IdEnsei");

            migrationBuilder.CreateIndex(
                name: "IX_seances_IdMatiere",
                table: "seances",
                column: "IdMatiere");

            migrationBuilder.CreateIndex(
                name: "IX_seances_IdSalle",
                table: "seances",
                column: "IdSalle");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "etudiants");

            migrationBuilder.DropTable(
                name: "seances");

            migrationBuilder.DropTable(
                name: "classes");

            migrationBuilder.DropTable(
                name: "emplois_du_temps");

            migrationBuilder.DropTable(
                name: "enseignants");

            migrationBuilder.DropTable(
                name: "matieres");

            migrationBuilder.DropTable(
                name: "salles");

            migrationBuilder.DropTable(
                name: "utilisateurs");
        }
    }
}
