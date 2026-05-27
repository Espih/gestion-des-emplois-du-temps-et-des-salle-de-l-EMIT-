using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionSallesEtEDT.Api.Migrations
{
    /// <inheritdoc />
    public partial class Update_EmploiDuTemps_With_DateOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dateCreation_edt",
                table: "emplois_du_temps");

            migrationBuilder.AddColumn<DateOnly>(
                name: "date_creation",
                table: "emplois_du_temps",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<DateOnly>(
                name: "date_modification",
                table: "emplois_du_temps",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "libelle_edt",
                table: "emplois_du_temps",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "statut",
                table: "emplois_du_temps",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "date_creation",
                table: "emplois_du_temps");

            migrationBuilder.DropColumn(
                name: "date_modification",
                table: "emplois_du_temps");

            migrationBuilder.DropColumn(
                name: "libelle_edt",
                table: "emplois_du_temps");

            migrationBuilder.DropColumn(
                name: "statut",
                table: "emplois_du_temps");

            migrationBuilder.AddColumn<DateTime>(
                name: "dateCreation_edt",
                table: "emplois_du_temps",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
