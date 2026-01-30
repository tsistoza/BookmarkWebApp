using BookmarkAPI.DTOs;
using BookmarkAPI.Entities;
using BookmarkAPI.Services;
using MongoDB.Bson;

namespace BookmarkAPI.Endpoints;

public static class BookmarkEndpoints
{
    public static readonly string endpoint = "/bookmarks";
    public static RouteGroupBuilder MapBookmarkEndpoints(this WebApplication app)
    {
        RouteGroupBuilder group = app.MapGroup(endpoint);
    
        group.MapGet("/{user}", async (string user, IBookmarkService dbService) =>
        {
            List<ExistBookmarkDTO> bookmarks = await dbService.GetAllBookmarksAsync(user);
            return Results.Ok(bookmarks);
        }).WithRequestTimeout(TimeSpan.FromSeconds(15))
        .RequireAuthorization();

        group.MapGet("/{user}/{id}", async (string user, Guid id, IBookmarkService dbService) =>
        {
            ExistBookmarkDTO bookmark = await dbService.GetBookmarkByIdAsync(id, user);
            return Results.Ok(bookmark);
        }).WithRequestTimeout(TimeSpan.FromSeconds(15))
        .RequireAuthorization();

        group.MapGet("/{user}/sortby/{tags}", async (string user, string tags, IBookmarkService dbService) =>
        {
            List<string> tagList = tags.Split('-').ToList();
            List<ExistBookmarkDTO> dtos = await dbService.GetAllBookmarksByTagAsync(user, tagList);
            return Results.Ok(dtos);
        }).WithRequestTimeout(TimeSpan.FromSeconds(15))
        .RequireAuthorization();

        group.MapPost("/add", async (NewBookmarkDTO dto, HttpContext httpService, IAuthService authService, IBookmarkService dbService) =>
        {
            // Check if valid user before adding to database
            bool result = await authService.AuthenticateUsernameAsync(dto.user);
            if (!result)
            {
                httpService.Response.Cookies.Delete("token", new CookieOptions
                {
                    Path = "/"
                });
                return Results.BadRequest();
            }

            Guid id = await dbService.AddBookmarkAsync(dto);
            return Results.Created(endpoint, id.ToJson());
        })
        .WithParameterValidation()
        .WithRequestTimeout(TimeSpan.FromSeconds(15))
        .RequireAuthorization();

        group.MapPut("/update/{user}/{id}", async (string user, string id, UpdateBookmarkDTO dto, IBookmarkService dbService) =>
        {
            bool result = await dbService.UpdateBookmarkAsync(dto);
            return (result) ? Results.NoContent() : Results.BadRequest();
        })
        .WithParameterValidation()
        .WithRequestTimeout(TimeSpan.FromSeconds(15))
        .RequireAuthorization();

        group.MapDelete("/delete/{user}/{id}", async (string user, Guid id, IBookmarkService dbService) =>
        {
            bool result = await dbService.DeleteBookmarkAsync(id);
            return (result) ? Results.NoContent() : Results.BadRequest();
        }).WithRequestTimeout(TimeSpan.FromSeconds(15))
        .RequireAuthorization();

        return group;
    }
}
