# ==========================================
# Étape 1 : Build
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copier le fichier projet
COPY GestionSallesEtEDT.Api/GestionSallesEtEDT.Api.csproj GestionSallesEtEDT.Api/

# Restaurer les dépendances
RUN dotnet restore GestionSallesEtEDT.Api/GestionSallesEtEDT.Api.csproj

# Copier le reste du code
COPY GestionSallesEtEDT.Api/ GestionSallesEtEDT.Api/

# Se placer dans le projet
WORKDIR /src/GestionSallesEtEDT.Api

# Publier l'application
RUN dotnet publish GestionSallesEtEDT.Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


# ==========================================
# Étape 2 : Image finale
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

# Copier l'application publiée
COPY --from=build /app/publish .

# Port utilisé par Render
ENV ASPNETCORE_HTTP_PORTS=8080

EXPOSE 8080

# Démarrer l'application
ENTRYPOINT ["dotnet", "GestionSallesEtEDT.Api.dll"]