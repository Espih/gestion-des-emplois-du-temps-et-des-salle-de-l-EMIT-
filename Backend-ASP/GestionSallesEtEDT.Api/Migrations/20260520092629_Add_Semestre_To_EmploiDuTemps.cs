using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionSallesEtEDT.Api.Migrations
{
    /// <inheritdoc />
    public partial class Add_Semestre_To_EmploiDuTemps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "id_utilisateur",
                table: "emplois_du_temps",
                newName: "id_semestre");

            migrationBuilder.RenameColumn(
                name: "id_cla",
                table: "emplois_du_temps",
                newName: "id_classe");

            migrationBuilder.AddColumn<int>(
                name: "id_annee",
                table: "emplois_du_temps",
                type: "integer",
                nullable: false,
                defaultValue: 0);

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

            migrationBuilder.AddForeignKey(
                name: "FK_emplois_du_temps_annees_universitaires_id_annee",
                table: "emplois_du_temps",
                column: "id_annee",
                principalTable: "annees_universitaires",
                principalColumn: "id_annee",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_emplois_du_temps_classes_id_classe",
                table: "emplois_du_temps",
                column: "id_classe",
                principalTable: "classes",
                principalColumn: "id_cla",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_emplois_du_temps_semestres_id_semestre",
                table: "emplois_du_temps",
                column: "id_semestre",
                principalTable: "semestres",
                principalColumn: "id_semestre",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_emplois_du_temps_annees_universitaires_id_annee",
                table: "emplois_du_temps");

            migrationBuilder.DropForeignKey(
                name: "FK_emplois_du_temps_classes_id_classe",
                table: "emplois_du_temps");

            migrationBuilder.DropForeignKey(
                name: "FK_emplois_du_temps_semestres_id_semestre",
                table: "emplois_du_temps");

            migrationBuilder.DropIndex(
                name: "IX_emplois_du_temps_id_annee",
                table: "emplois_du_temps");

            migrationBuilder.DropIndex(
                name: "IX_emplois_du_temps_id_classe",
                table: "emplois_du_temps");

            migrationBuilder.DropIndex(
                name: "IX_emplois_du_temps_id_semestre",
                table: "emplois_du_temps");

            migrationBuilder.DropColumn(
                name: "id_annee",
                table: "emplois_du_temps");

            migrationBuilder.RenameColumn(
                name: "id_semestre",
                table: "emplois_du_temps",
                newName: "id_utilisateur");

            migrationBuilder.RenameColumn(
                name: "id_classe",
                table: "emplois_du_temps",
                newName: "id_cla");
        }
    }
}
