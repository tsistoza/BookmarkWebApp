
using System.ComponentModel.DataAnnotations;

namespace BookmarkAPI.DTOs;

public record class NewBookmarkDTO(
        [Required] string user,
        [Required] DateOnly dateAdded,
        [Required, Length(5, 15)] string title,
        string? description,
        [Required] string url,
        List<string>? tags
    );
