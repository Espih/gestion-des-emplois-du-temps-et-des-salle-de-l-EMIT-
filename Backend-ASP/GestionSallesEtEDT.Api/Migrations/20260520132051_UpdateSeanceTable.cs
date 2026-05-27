using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionSallesEtEDT.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeanceTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_seances_Salles_IdSalle",
                table: "seances");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_emplois_du_temps_IdEdt",
                table: "seances");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_enseignants_IdEnsei",
                table: "seances");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_matieres_IdMatiere",
                table: "seances");

            migrationBuilder.RenameColumn(
                name: "heureFin_seance",
                table: "seances",
                newName: "heure_fin");

            migrationBuilder.RenameColumn(
                name: "heureDebut_seance",
                table: "seances",
                newName: "heure_debut");

            migrationBuilder.RenameColumn(
                name: "IdSalle",
                table: "seances",
                newName: "id_semestre");

            migrationBuilder.RenameColumn(
                name: "IdMatiere",
                table: "seances",
                newName: "id_salle");

            migrationBuilder.RenameColumn(
                name: "IdEnsei",
                table: "seances",
                newName: "id_matiere");

            migrationBuilder.RenameColumn(
                name: "IdEdt",
                table: "seances",
                newName: "id_enseignant");

            migrationBuilder.RenameIndex(
                name: "IX_seances_IdSalle",
                table: "seances",
                newName: "IX_seances_id_semestre");

            migrationBuilder.RenameIndex(
                name: "IX_seances_IdMatiere",
                table: "seances",
                newName: "IX_seances_id_salle");

            migrationBuilder.RenameIndex(
                name: "IX_seances_IdEnsei",
                table: "seances",
                newName: "IX_seances_id_matiere");

            migrationBuilder.RenameIndex(
                name: "IX_seances_IdEdt",
                table: "seances",
                newName: "IX_seances_id_enseignant");

            migrationBuilder.AddColumn<int>(
                name: "EmploiDuTempsIdEdt",
                table: "seances",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "id_classe",
                table: "seances",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_seances_EmploiDuTempsIdEdt",
                table: "seances",
                column: "EmploiDuTempsIdEdt");

            migrationBuilder.CreateIndex(
                name: "IX_seances_id_classe",
                table: "seances",
                column: "id_classe");

            migrationBuilder.AddForeignKey(
                name: "FK_seances_Salles_id_salle",
                table: "seances",
                column: "id_salle",
                principalTable: "Salles",
                principalColumn: "id_salle",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_seances_classes_id_classe",
                table: "seances",
                column: "id_classe",
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
                name: "FK_seances_enseignants_id_enseignant",
                table: "seances",
                column: "id_enseignant",
                principalTable: "enseignants",
                principalColumn: "id_ensei",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_seances_matieres_id_matiere",
                table: "seances",
                column: "id_matiere",
                principalTable: "matieres",
                principalColumn: "id_matiere",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_seances_semestres_id_semestre",
                table: "seances",
                column: "id_semestre",
                principalTable: "semestres",
                principalColumn: "id_semestre",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_seances_Salles_id_salle",
                table: "seances");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_classes_id_classe",
                table: "seances");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_emplois_du_temps_EmploiDuTempsIdEdt",
                table: "seances");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_enseignants_id_enseignant",
                table: "seances");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_matieres_id_matiere",
                table: "seances");

            migrationBuilder.DropForeignKey(
                name: "FK_seances_semestres_id_semestre",
                table: "seances");

            migrationBuilder.DropIndex(
                name: "IX_seances_EmploiDuTempsIdEdt",
                table: "seances");

            migrationBuilder.DropIndex(
                name: "IX_seances_id_classe",
                table: "seances");

            migrationBuilder.DropColumn(
                name: "EmploiDuTempsIdEdt",
                table: "seances");

            migrationBuilder.DropColumn(
                name: "id_classe",
                table: "seances");

            migrationBuilder.RenameColumn(
                name: "heure_fin",
                table: "seances",
                newName: "heureFin_seance");

            migrationBuilder.RenameColumn(
                name: "heure_debut",
                table: "seances",
                newName: "heureDebut_seance");

            migrationBuilder.RenameColumn(
                name: "id_semestre",
                table: "seances",
                newName: "IdSalle");

            migrationBuilder.RenameColumn(
                name: "id_salle",
                table: "seances",
                newName: "IdMatiere");

            migrationBuilder.RenameColumn(
                name: "id_matiere",
                table: "seances",
                newName: "IdEnsei");

            migrationBuilder.RenameColumn(
                name: "id_enseignant",
                table: "seances",
                newName: "IdEdt");

            migrationBuilder.RenameIndex(
                name: "IX_seances_id_semestre",
                table: "seances",
                newName: "IX_seances_IdSalle");

            migrationBuilder.RenameIndex(
                name: "IX_seances_id_salle",
                table: "seances",
                newName: "IX_seances_IdMatiere");

            migrationBuilder.RenameIndex(
                name: "IX_seances_id_matiere",
                table: "seances",
                newName: "IX_seances_IdEnsei");

            migrationBuilder.RenameIndex(
                name: "IX_seances_id_enseignant",
                table: "seances",
                newName: "IX_seances_IdEdt");

            migrationBuilder.AddForeignKey(
                name: "FK_seances_Salles_IdSalle",
                table: "seances",
                column: "IdSalle",
                principalTable: "Salles",
                principalColumn: "id_salle",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_seances_emplois_du_temps_IdEdt",
                table: "seances",
                column: "IdEdt",
                principalTable: "emplois_du_temps",
                principalColumn: "id_edt",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_seances_enseignants_IdEnsei",
                table: "seances",
                column: "IdEnsei",
                principalTable: "enseignants",
                principalColumn: "id_ensei",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_seances_matieres_IdMatiere",
                table: "seances",
                column: "IdMatiere",
                principalTable: "matieres",
                principalColumn: "id_matiere",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
