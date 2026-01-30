using BookmarkAPI.DTOs;
using BookmarkAPI.Entities;
using MongoDB.Driver;
using BookmarkAPI.Mapping;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace BookmarkAPI.Services;

public interface IAuthService
{
    Task<bool> AuthenticateUsernameAsync(string username);
    Task<bool> AuthenticateAsync(CredentialDTO dto);
    Task<bool> RegisterAsync(CredentialDTO dto);
    string CreateJWT(IConfiguration config, CredentialDTO dto);
}

public class MongoAuthService : IAuthService
{
    private IMongoCollection<Credential> _authCollection;
    public MongoAuthService(IMongoClient dbContext)
    {
        IMongoDatabase db = dbContext.GetDatabase("AuthDB");
        _authCollection = db.GetCollection<Credential>("SecureCollection");
    }

    public async Task<bool> AuthenticateUsernameAsync(string username)
    {
        Credential? cred = await _authCollection.Find(cred => cred.username == username).FirstOrDefaultAsync();
        return cred != null;
    }

    public async Task<bool> AuthenticateAsync(CredentialDTO dto)
    {
        string username = dto.username;
        string password = dto.password;
        Credential? cred = await _authCollection.Find(credential => credential.username == username && credential.password == password)
                       .FirstOrDefaultAsync();
        return cred != null;
    }

    public async Task<bool> RegisterAsync(CredentialDTO dto)
    {
        string username = dto.username;
        string password = dto.password;
        Credential? cred = await _authCollection.Find(credential => credential.username == username).FirstOrDefaultAsync();
        if (cred == null)
        {
            await _authCollection.InsertOneAsync(dto.ToEntity());
            return true;
        }

        return false;
    }

    public string CreateJWT(IConfiguration config, CredentialDTO dto)
    {
        IConfigurationSection jwtSection = config.GetSection("Jwt");
        byte[] key = Encoding.UTF8.GetBytes(jwtSection["Key"]!);

        Claim[] claims = new Claim[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, dto.username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, dto.username)
        };

        SigningCredentials sgn = new SigningCredentials(
                              new SymmetricSecurityKey(key),
                              SecurityAlgorithms.HmacSha256);

        DateTime expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSection["ExpiresInMinutes"]!));

        JwtSecurityToken token = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: sgn
            );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}
