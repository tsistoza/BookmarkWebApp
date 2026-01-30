using System.ComponentModel.DataAnnotations;

namespace BookmarkAPI.DTOs;

public record class ExistBookmarkDTO(
        [Required] Guid id,
        [Required] string user,
        [Required] DateOnly dateAdded,
        [Required] string title,
        [Required] string url,
        string? description,
        List<string>? tags
    );
