using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionSallesEtEDT.Api.Migrations
{
    /// <inheritdoc />
    public partial class CreateSalleTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_seances_salles_IdSalle",
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
                name: "FK_seances_Salles_IdSalle",
                table: "seances",
                column: "IdSalle",
                principalTable: "Salles",
                principalColumn: "id_salle",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_seances_Salles_IdSalle",
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
                name: "FK_seances_salles_IdSalle",
                table: "seances",
                column: "IdSalle",
                principalTable: "salles",
                principalColumn: "id_salle",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
