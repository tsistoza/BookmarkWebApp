using BookmarkAPI.DTOs;
using BookmarkAPI.Services;

namespace BookmarkAPI.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this WebApplication app)
    {
        RouteGroupBuilder group = app.MapGroup("/auth");

        group.MapPost("/register", async (CredentialDTO dto, HttpContext httpService, IConfiguration config, IAuthService dbService) =>
        {
            bool result = await dbService.RegisterAsync(dto);
            if (!result) return Results.BadRequest();

            string jwtToken = dbService.CreateJWT(config, dto);

            httpService.Response.Cookies.Append("token", jwtToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
            });

            return Results.Accepted();
        }).WithRequestTimeout(TimeSpan.FromSeconds(15));

        group.MapPost("/login", async (CredentialDTO dto, IConfiguration config, HttpContext httpService, IAuthService dbService) =>
        {
            bool result = await dbService.AuthenticateAsync(dto);
            if (!result) return Results.BadRequest();

            string jwtToken = dbService.CreateJWT(config, dto);
            httpService.Response.Cookies.Append("token", jwtToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
            });

            return (result) ? Results.Accepted() : Results.BadRequest();
        }).WithRequestTimeout(TimeSpan.FromSeconds(15));

        group.MapDelete("/logout", async (HttpContext httpContext) =>
        {
            httpContext.Response.Cookies.Delete("token", new CookieOptions()
            {
                Path = "/",
            });

            return Results.Accepted();
        });


        return group;
    }
}
