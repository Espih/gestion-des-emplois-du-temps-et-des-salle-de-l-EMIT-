using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionSallesEtEDT.Api.Migrations
{
    /// <inheritdoc />
    public partial class Modification_table_enseignant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_enseignants_utilisateurs_id_ensei",
                table: "enseignants");

            migrationBuilder.RenameColumn(
                name: "id_ensei",
                table: "enseignants",
                newName: "id_enseignant");

            migrationBuilder.AlterColumn<string>(
                name: "telephone_ensei",
                table: "enseignants",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "email_ensei",
                table: "enseignants",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "nom_enseignant",
                table: "enseignants",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "prenom_enseignant",
                table: "enseignants",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_enseignants_utilisateurs_id_enseignant",
                table: "enseignants",
                column: "id_enseignant",
                principalTable: "utilisateurs",
                principalColumn: "id_utilisateur",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_enseignants_utilisateurs_id_enseignant",
                table: "enseignants");

            migrationBuilder.DropColumn(
                name: "email_ensei",
                table: "enseignants");

            migrationBuilder.DropColumn(
                name: "nom_enseignant",
                table: "enseignants");

            migrationBuilder.DropColumn(
                name: "prenom_enseignant",
                table: "enseignants");

            migrationBuilder.RenameColumn(
                name: "id_enseignant",
                table: "enseignants",
                newName: "id_ensei");

            migrationBuilder.AlterColumn<string>(
                name: "telephone_ensei",
                table: "enseignants",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddForeignKey(
                name: "FK_enseignants_utilisateurs_id_ensei",
                table: "enseignants",
                column: "id_ensei",
                principalTable: "utilisateurs",
                principalColumn: "id_utilisateur",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
