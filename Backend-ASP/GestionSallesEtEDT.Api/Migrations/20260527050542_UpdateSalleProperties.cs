using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionSallesEtEDT.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSalleProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_seances_Salles_id_salle",
                table: "seances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Salles",
                table: "Salles");

            migrationBuilder.RenameTable(
                name: "Salles",
                newName: "salles");

            migrationBuilder.AddPrimaryKey(
                name: "PK_salles",
                table: "salles",
                column: "id_salle");

            migrationBuilder.AddForeignKey(
                name: "FK_seances_salles_id_salle",
                table: "seances",
                column: "id_salle",
                principalTable: "salles",
                principalColumn: "id_salle",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_seances_salles_id_salle",
                table: "seances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_salles",
                table: "salles");

            migrationBuilder.RenameTable(
                name: "salles",
                newName: "Salles");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Salles",
                table: "Salles",
                column: "id_salle");

            migrationBuilder.AddForeignKey(
                name: "FK_seances_Salles_id_salle",
                table: "seances",
                column: "id_salle",
                principalTable: "Salles",
                principalColumn: "id_salle",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
