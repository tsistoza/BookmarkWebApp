using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BookmarkAPI.Entities;

public class Bookmark
{
    [BsonId]
    [BsonGuidRepresentation(GuidRepresentation.Standard)]
    public Guid id { get; set; }
    public required string User { get; set; }
    public DateOnly DateAdded { get; set; }
    public required string Title { get; set; }
    public required string Url { get; set; }
    public string? Description { get; set; }
    public List<string>? Tags { get; set; }
}
