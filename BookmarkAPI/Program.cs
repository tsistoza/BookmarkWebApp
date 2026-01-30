using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using MongoDB.Bson;
using BookmarkAPI.Services;
using BookmarkAPI.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Jwt Authentication & Authorization
IConfigurationSection jwtParams = builder.Configuration.GetSection("Jwt");
const string schemeName = "Bearer";
byte[] key = Encoding.UTF8.GetBytes(jwtParams["Key"]!);


builder.Services
    .AddAuthentication((authOptions) => // Task<AuthenticationOptions>
    {
        authOptions.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        authOptions.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(schemeName, (jwtOptions) => // Task<JwtBearerOptions>
    {
        jwtOptions.Events = new JwtBearerEvents()
        {
            OnMessageReceived = (msgContext) => // Task<MessageRecievedContext>
            {
                if (msgContext.Request.Cookies.TryGetValue("token", out string? token))
                    msgContext.Token = token;
                return Task.CompletedTask;
            }
        };
    
        jwtOptions.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwtParams["Issuer"],
            ValidAudience = jwtParams["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });
builder.Services.AddAuthorization();


// DEFINE CORS
const string corsPolicy = "AllowedOriginsPolicy";
builder.Services.AddCors(options =>
{
    // Create a policy, for CORS
    Microsoft.AspNetCore.Cors.Infrastructure.CorsPolicyBuilder builder = new();
    builder.WithOrigins("http://localhost:5173")
           .WithMethods("GET", "PUT", "DELETE", "POST")
           .AllowAnyHeader()
           .AllowCredentials();

    options.AddPolicy(name: corsPolicy, builder.Build());
});


// Add a mongo database, Add a Serializer
string connectionString = builder.Configuration.GetConnectionString("MongoDbConnect")!;
BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));
builder.Services.AddSingleton<IMongoClient>(new MongoClient(connectionString));
builder.Services.AddScoped<IAuthService, MongoAuthService>();
builder.Services.AddScoped<IBookmarkService, BookmarkService>();


WebApplication app = builder.Build();


// Security
app.UseCors(corsPolicy);
app.UseAuthentication();
app.UseAuthorization();

// Endpoints
app.MapAuthEndpoints();
app.MapBookmarkEndpoints();
app.Run();

