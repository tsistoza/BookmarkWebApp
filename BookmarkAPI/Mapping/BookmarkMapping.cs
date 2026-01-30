using BookmarkAPI.Entities;
using BookmarkAPI.DTOs;

namespace BookmarkAPI.Mapping;

public static class BookmarkMapping
{
    public static ExistBookmarkDTO ToDTOFromDocument(this Bookmark entity)
    {
        return new ExistBookmarkDTO(
                id: entity.id,
                user: entity.User,
                dateAdded: entity.DateAdded,
                title: entity.Title,
                url: entity.Url,
                description: entity.Description,
                tags: entity.Tags
            );
    }

    public static Bookmark ToEntityOld(this ExistBookmarkDTO dto)
    {
        return new Bookmark()
        {
            id = dto.id,
            User = dto.user,
            DateAdded = dto.dateAdded,
            Title = dto.title,
            Url = dto.url,
            Description = dto.description,
            Tags = dto.tags
        };
    }

    public static Bookmark ToEntityNew(this NewBookmarkDTO dto)
    {
        return new Bookmark()
        {
            User = dto.user,
            DateAdded = dto.dateAdded,
            Title = dto.title,
            Url = dto.url,
            Description = dto.description,
            Tags = dto.tags
        };
    }
}
