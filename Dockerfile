# Grab ASP.Net Runtime
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS Base
WORKDIR "/app"
# Expose ports to outside to use with application
EXPOSE 80
EXPOSE 443


# Grab ASP.Net SDK
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR "/src"
# Copy project file and restore packages
COPY ["*.csproj", "./"]
RUN dotnet restore
# Copy the rest of the project
COPY . ./
WORKDIR "/src/."
# Build project
RUN dotnet build -c Release -o /app/build
# Update OS and install required dependencies
RUN apt-get update
RUN apt-get install -y apt-utils
RUN apt-get install -y wget gnupg2 curl
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y build-essential nodejs


# Publish application
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish


# Finish
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
#ENTRYPOINT ["dotnet", "gotango.dll"]
CMD ASPNETCORE_URLS=http://*:$PORT dotnet gotango.dll

# See available docker images
# sudo docker images

# Build docker image
# sudo docker build -t gotango

# Purge dangling docker images i.e. no relationship to any current image
# sudo docker image prune

# Purge unused docker images i.e. all images not in a container
# sudo docker image prune -a

# Purge everything
# sudo docker system prune -a --volumes

# Push to heroku
# sudo heroku container:push web -a obscure-crag-87544
# sudo heroku container:release web -a obscure-crag-87544

