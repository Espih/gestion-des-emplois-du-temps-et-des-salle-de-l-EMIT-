using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GestionSallesEtEDT.Api.Migrations
{
    /// <inheritdoc />
    public partial class CreateAnneeUniversitaireTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "annees_universitaires",
                columns: table => new
                {
                    id_annee = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle_annee = table.Column<string>(type: "text", nullable: false),
                    date_debut = table.Column<DateOnly>(type: "date", nullable: false),
                    date_fin = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_annees_universitaires", x => x.id_annee);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "annees_universitaires");
        }
    }
}
