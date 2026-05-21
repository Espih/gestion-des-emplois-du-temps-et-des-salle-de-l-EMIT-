using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionSallesEtEDT.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixSeanceForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_seances_classes_id_classe",
                table: "seances");

            migrationBuilder.RenameColumn(
                name: "jour_seance",
                table: "seances",
                newName: "jour");

            migrationBuilder.RenameColumn(
                name: "id_classe",
                table: "seances",
                newName: "id_cla");

            migrationBuilder.RenameIndex(
                name: "IX_seances_id_classe",
                table: "seances",
                newName: "IX_seances_id_cla");

            migrationBuilder.AddForeignKey(
                name: "FK_seances_classes_id_cla",
                table: "seances",
                column: "id_cla",
                principalTable: "classes",
                principalColumn: "id_cla",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_seances_classes_id_cla",
                table: "seances");

            migrationBuilder.RenameColumn(
                name: "jour",
                table: "seances",
                newName: "jour_seance");

            migrationBuilder.RenameColumn(
                name: "id_cla",
                table: "seances",
                newName: "id_classe");

            migrationBuilder.RenameIndex(
                name: "IX_seances_id_cla",
                table: "seances",
                newName: "IX_seances_id_classe");

            migrationBuilder.AddForeignKey(
                name: "FK_seances_classes_id_classe",
                table: "seances",
                column: "id_classe",
                principalTable: "classes",
                principalColumn: "id_cla",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
