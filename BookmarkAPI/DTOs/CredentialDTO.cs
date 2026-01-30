using System.ComponentModel.DataAnnotations;

namespace BookmarkAPI.DTOs;

public record class CredentialDTO(
    [Required, Length(4, 20)] string username,
    [Required, Length(8, 20)] string password
    );
