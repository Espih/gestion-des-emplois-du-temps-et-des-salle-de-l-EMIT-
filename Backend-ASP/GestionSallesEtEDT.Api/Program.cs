using GestionSallesEtEDT.Api.Data; 
using GestionSallesEtEDT.Api.Services; // Assure-toi que ce namespace correspond à tes dossiers
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- 1. SERVICES : CONFIGURATION POSTGRESQL ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// --- 2. SERVICES : AUTHENTIFICATION JWT ---
builder.Services.AddScoped<IAuthService, AuthService>();

var key = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Clé JWT non trouvée.");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key))
    };
});

// --- 3. SERVICES : CONFIGURATION CORS ---
builder.Services.AddCors(options => {
    options.AddPolicy("FrontendPolicy", policy => {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// --- 4. SERVICES : API & SWAGGER ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- 5. PIPELINE : CONFIGURATION REQUÊTES ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Activer CORS
app.UseCors("FrontendPolicy");

// --- 6. SÉCURITÉ : L'ORDRE EST ESSENTIEL ---
app.UseAuthentication(); 
app.UseAuthorization();  

app.MapControllers(); 

app.Run();