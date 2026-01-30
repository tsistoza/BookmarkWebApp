using BookmarkAPI.Entities;
using BookmarkAPI.DTOs;

namespace BookmarkAPI.Mapping;

public static class CredentialMapping
{
    public static Credential ToEntity(this CredentialDTO dto)
    {
        return new Credential()
        {
            username = dto.username,
            password = dto.password
        };
    }

    public static CredentialDTO ToDTO(this Credential dto)
    {
        return new CredentialDTO(
                dto.username,
                dto.password
            );
    }
}
