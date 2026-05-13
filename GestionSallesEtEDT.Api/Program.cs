using GestionSallesEtEDT.Api.Data; // Assurez-vous que ce namespace correspond à votre dossier Data
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- 1. SERVICES : CONFIGURATION POSTGRESQL ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// --- 2. SERVICES : CONFIGURATION CORS ---
// Permet au frontend de communiquer avec l'API
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// --- 3. SERVICES : API & SWAGGER ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- 4. PIPELINE : CONFIGURATION REQUÊTES ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Activer CORS avant l'autorisation
app.UseCors("AllowAll");

app.UseHttpsRedirection();

// IMPORTANT : Remplace les MapGet par défaut par le routage des contrôleurs
app.UseAuthorization();
app.MapControllers(); 

app.Run();