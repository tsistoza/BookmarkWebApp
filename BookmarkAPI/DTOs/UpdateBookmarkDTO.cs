using System.ComponentModel.DataAnnotations;

namespace BookmarkAPI.DTOs;

public record class UpdateBookmarkDTO(
        [Required] Guid id,
        [Required] string title,
        [Required] string url,
        string? description,
        List<string>? tags
    );

