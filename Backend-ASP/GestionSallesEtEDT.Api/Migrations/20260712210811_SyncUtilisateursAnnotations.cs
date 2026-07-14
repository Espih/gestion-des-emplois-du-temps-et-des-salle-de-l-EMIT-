using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GestionSallesEtEDT.Api.Migrations
{
    /// <inheritdoc />
    public partial class SyncUtilisateursAnnotations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_enseignants_utilisateurs_id_enseignant",
                table: "enseignants");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_classes_id_cla",
                table: "seances");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_emplois_du_temps_EmploiDuTempsIdEdt",
                table: "seances");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_semestres_id_semestre",
                table: "seances");

            migrationBuilder.DropTable(
                name: "emplois_du_temps");

            migrationBuilder.DropTable(
                name: "etudiants");

            migrationBuilder.DropTable(
                name: "annees_universitaires");

            migrationBuilder.DropTable(
                name: "semestres");

            migrationBuilder.DropIndex(
                name: "IX_seances_EmploiDuTempsIdEdt",
                table: "seances");

            migrationBuilder.DropIndex(
                name: "IX_seances_id_cla",
                table: "seances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_classes",
                table: "classes");

            migrationBuilder.DropColumn(
                name: "mdp_uti",
                table: "utilisateurs");

            migrationBuilder.DropColumn(
                name: "nom_uti",
                table: "utilisateurs");

            migrationBuilder.DropColumn(
                name: "prenom_uti",
                table: "utilisateurs");

            migrationBuilder.DropColumn(
                name: "EmploiDuTempsIdEdt",
                table: "seances");

            migrationBuilder.DropColumn(
                name: "id_cla",
                table: "seances");

            migrationBuilder.DropColumn(
                name: "code_salle",
                table: "salles");

            migrationBuilder.DropColumn(
                name: "coefficient_matiere",
                table: "matieres");

            migrationBuilder.DropColumn(
                name: "email_ensei",
                table: "enseignants");

            migrationBuilder.DropColumn(
                name: "prenom_enseignant",
                table: "enseignants");

            migrationBuilder.DropColumn(
                name: "telephone_ensei",
                table: "enseignants");

            migrationBuilder.DropColumn(
                name: "nom_cla",
                table: "classes");

            migrationBuilder.RenameColumn(
                name: "email_uti",
                table: "utilisateurs",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "role_uti",
                table: "utilisateurs",
                newName: "mot_de_passe");

            migrationBuilder.RenameColumn(
                name: "id_semestre",
                table: "seances",
                newName: "id_classe");

            migrationBuilder.RenameIndex(
                name: "IX_seances_id_semestre",
                table: "seances",
                newName: "IX_seances_id_classe");

            migrationBuilder.RenameColumn(
                name: "type_salle",
                table: "salles",
                newName: "nom_salle");

            migrationBuilder.RenameColumn(
                name: "libelle_matiere",
                table: "matieres",
                newName: "nom_matiere");

            migrationBuilder.RenameColumn(
                name: "code_matiere",
                table: "matieres",
                newName: "couleur");

            migrationBuilder.RenameColumn(
                name: "nom_enseignant",
                table: "enseignants",
                newName: "nom");

            migrationBuilder.RenameColumn(
                name: "niveau_cla",
                table: "classes",
                newName: "niveau");

            migrationBuilder.RenameColumn(
                name: "id_cla",
                table: "classes",
                newName: "id_parcours");

            migrationBuilder.AlterColumn<string>(
                name: "heure_fin",
                table: "seances",
                type: "text",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "interval");

            migrationBuilder.AlterColumn<string>(
                name: "heure_debut",
                table: "seances",
                type: "text",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "interval");

            migrationBuilder.AddColumn<int>(
                name: "capacite",
                table: "salles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "id_enseignant",
                table: "enseignants",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<string>(
                name: "nom",
                table: "enseignants",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "civilite",
                table: "enseignants",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "id_parcours",
                table: "classes",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "id_classe",
                table: "classes",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_classes",
                table: "classes",
                column: "id_classe");

            migrationBuilder.CreateTable(
                name: "mentions",
                columns: table => new
                {
                    id_mention = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom_mention = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mentions", x => x.id_mention);
                });

            migrationBuilder.CreateTable(
                name: "parcours",
                columns: table => new
                {
                    id_parcours = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom_parcours = table.Column<string>(type: "text", nullable: false),
                    id_mention = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_parcours", x => x.id_parcours);
                    table.ForeignKey(
                        name: "FK_parcours_mentions_id_mention",
                        column: x => x.id_mention,
                        principalTable: "mentions",
                        principalColumn: "id_mention",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_classes_id_parcours",
                table: "classes",
                column: "id_parcours");

            migrationBuilder.CreateIndex(
                name: "IX_parcours_id_mention",
                table: "parcours",
                column: "id_mention");

            migrationBuilder.AddForeignKey(
                name: "FK_classes_parcours_id_parcours",
                table: "classes",
                column: "id_parcours",
                principalTable: "parcours",
                principalColumn: "id_parcours",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_seances_classes_id_classe",
                table: "seances",
                column: "id_classe",
                principalTable: "classes",
                principalColumn: "id_classe",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_classes_parcours_id_parcours",
                table: "classes");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_classes_id_classe",
                table: "seances");

            migrationBuilder.DropTable(
                name: "parcours");

            migrationBuilder.DropTable(
                name: "mentions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_classes",
                table: "classes");

            migrationBuilder.DropIndex(
                name: "IX_classes_id_parcours",
                table: "classes");

            migrationBuilder.DropColumn(
                name: "capacite",
                table: "salles");

            migrationBuilder.DropColumn(
                name: "civilite",
                table: "enseignants");

            migrationBuilder.DropColumn(
                name: "id_classe",
                table: "classes");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "utilisateurs",
                newName: "email_uti");

            migrationBuilder.RenameColumn(
                name: "mot_de_passe",
                table: "utilisateurs",
                newName: "role_uti");

            migrationBuilder.RenameColumn(
                name: "id_classe",
                table: "seances",
                newName: "id_semestre");

            migrationBuilder.RenameIndex(
                name: "IX_seances_id_classe",
                table: "seances",
                newName: "IX_seances_id_semestre");

            migrationBuilder.RenameColumn(
                name: "nom_salle",
                table: "salles",
                newName: "type_salle");

            migrationBuilder.RenameColumn(
                name: "nom_matiere",
                table: "matieres",
                newName: "libelle_matiere");

            migrationBuilder.RenameColumn(
                name: "couleur",
                table: "matieres",
                newName: "code_matiere");

            migrationBuilder.RenameColumn(
                name: "nom",
                table: "enseignants",
                newName: "nom_enseignant");

            migrationBuilder.RenameColumn(
                name: "niveau",
                table: "classes",
                newName: "niveau_cla");

            migrationBuilder.RenameColumn(
                name: "id_parcours",
                table: "classes",
                newName: "id_cla");

            migrationBuilder.AddColumn<string>(
                name: "mdp_uti",
                table: "utilisateurs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "nom_uti",
                table: "utilisateurs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "prenom_uti",
                table: "utilisateurs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "heure_fin",
                table: "seances",
                type: "interval",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "heure_debut",
                table: "seances",
                type: "interval",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "EmploiDuTempsIdEdt",
                table: "seances",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "id_cla",
                table: "seances",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "code_salle",
                table: "salles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "coefficient_matiere",
                table: "matieres",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AlterColumn<int>(
                name: "id_enseignant",
                table: "enseignants",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<string>(
                name: "nom_enseignant",
                table: "enseignants",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "email_ensei",
                table: "enseignants",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "prenom_enseignant",
                table: "enseignants",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "telephone_ensei",
                table: "enseignants",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "id_cla",
                table: "classes",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "nom_cla",
                table: "classes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_classes",
                table: "classes",
                column: "id_cla");

            migrationBuilder.CreateTable(
                name: "annees_universitaires",
                columns: table => new
                {
                    id_annee = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    date_debut = table.Column<DateOnly>(type: "date", nullable: false),
                    date_fin = table.Column<DateOnly>(type: "date", nullable: false),
                    libelle_annee = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_annees_universitaires", x => x.id_annee);
                });

            migrationBuilder.CreateTable(
                name: "etudiants",
                columns: table => new
                {
                    id_etudiant = table.Column<int>(type: "integer", nullable: false),
                    id_cla = table.Column<int>(type: "integer", nullable: false),
                    matricule_etu = table.Column<string>(type: "text", nullable: false)
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
                name: "semestres",
                columns: table => new
                {
                    id_semestre = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom_semestre = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_semestres", x => x.id_semestre);
                });

            migrationBuilder.CreateTable(
                name: "emplois_du_temps",
                columns: table => new
                {
                    id_edt = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_annee = table.Column<int>(type: "integer", nullable: false),
                    id_classe = table.Column<int>(type: "integer", nullable: false),
                    id_semestre = table.Column<int>(type: "integer", nullable: false),
                    date_creation = table.Column<DateOnly>(type: "date", nullable: false),
                    date_modification = table.Column<DateOnly>(type: "date", nullable: true),
                    libelle_edt = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    statut = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_emplois_du_temps", x => x.id_edt);
                    table.ForeignKey(
                        name: "FK_emplois_du_temps_annees_universitaires_id_annee",
                        column: x => x.id_annee,
                        principalTable: "annees_universitaires",
                        principalColumn: "id_annee",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_emplois_du_temps_classes_id_classe",
                        column: x => x.id_classe,
                        principalTable: "classes",
                        principalColumn: "id_cla",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_emplois_du_temps_semestres_id_semestre",
                        column: x => x.id_semestre,
                        principalTable: "semestres",
                        principalColumn: "id_semestre",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_seances_EmploiDuTempsIdEdt",
                table: "seances",
                column: "EmploiDuTempsIdEdt");

            migrationBuilder.CreateIndex(
                name: "IX_seances_id_cla",
                table: "seances",
                column: "id_cla");

            migrationBuilder.CreateIndex(
                name: "IX_emplois_du_temps_id_annee",
                table: "emplois_du_temps",
                column: "id_annee");

            migrationBuilder.CreateIndex(
                name: "IX_emplois_du_temps_id_classe",
                table: "emplois_du_temps",
                column: "id_classe");

            migrationBuilder.CreateIndex(
                name: "IX_emplois_du_temps_id_semestre",
                table: "emplois_du_temps",
                column: "id_semestre");

            migrationBuilder.CreateIndex(
                name: "IX_etudiants_id_cla",
                table: "etudiants",
                column: "id_cla");

            migrationBuilder.AddForeignKey(
                name: "FK_enseignants_utilisateurs_id_enseignant",
                table: "enseignants",
                column: "id_enseignant",
                principalTable: "utilisateurs",
                principalColumn: "id_utilisateur",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_seances_classes_id_cla",
                table: "seances",
                column: "id_cla",
                principalTable: "classes",
                principalColumn: "id_cla",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_seances_emplois_du_temps_EmploiDuTempsIdEdt",
                table: "seances",
                column: "EmploiDuTempsIdEdt",
                principalTable: "emplois_du_temps",
                principalColumn: "id_edt");

            migrationBuilder.AddForeignKey(
                name: "FK_seances_semestres_id_semestre",
                table: "seances",
                column: "id_semestre",
                principalTable: "semestres",
                principalColumn: "id_semestre",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
