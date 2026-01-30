using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace BookmarkAPI.Entities;

public class Credential
{
    [BsonId, BsonGuidRepresentation(GuidRepresentation.Standard)]
    public Guid id { get; set; }
    public required string username { get; set; }
    public required string password { get; set; }
}
