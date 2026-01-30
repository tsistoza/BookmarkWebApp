FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY BookmarkAPI.csproj .

RUN dotnet restore

COPY . .

RUN dotnet publish -c release -o build

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /src/build .

EXPOSE 5225

ENTRYPOINT [ "dotnet", "BookmarkAPI.dll" ]