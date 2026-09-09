using GestionSallesEtEDT.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GestionSallesEtEDT.Api.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            await context.Database.MigrateAsync();

            if (await context.Utilisateurs.AnyAsync())
                return;

            var hasher = new PasswordHasher<Utilisateur>();

            var admin = new Utilisateur
            {
                Email = "esperencioran@gmail.com"
            };

            admin.MotDePasse = hasher.HashPassword(
                admin,
                "123456789"
            );

            context.Utilisateurs.Add(admin);

            await context.SaveChangesAsync();
        }
    }
}