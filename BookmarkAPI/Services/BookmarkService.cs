using BookmarkAPI.DTOs;
using MongoDB.Driver;
using BookmarkAPI.Entities;
using BookmarkAPI.Mapping;
using MongoDB.Bson;

namespace BookmarkAPI.Services;

public interface IBookmarkService
{
    Task<List<ExistBookmarkDTO>> GetAllBookmarksAsync(string user);
    Task<ExistBookmarkDTO> GetBookmarkByIdAsync(Guid id, string user);
    Task<List<ExistBookmarkDTO>> GetAllBookmarksByTagAsync(string user, List<string> tags);
    Task<Guid> AddBookmarkAsync(NewBookmarkDTO item);
    Task<bool> UpdateBookmarkAsync(UpdateBookmarkDTO dto);
    Task<bool> DeleteBookmarkAsync(Guid id);
}

public class BookmarkService : IBookmarkService
{
    private IMongoCollection<Bookmark> _bookmarksCollection;

    public BookmarkService(IMongoClient mongoClient)
    {
        IMongoDatabase database = mongoClient.GetDatabase("BookmarkDB");
        _bookmarksCollection = database.GetCollection<Bookmark>("Bookmarks");
    }

    public async Task<List<ExistBookmarkDTO>> GetAllBookmarksAsync(string user)
    {
        return await _bookmarksCollection.Find(item => item.User == user).ToListAsync()
                                          .ContinueWith(task => task.Result
                                                        .ConvertAll(item => item.ToDTOFromDocument()));
    }

    public async Task<ExistBookmarkDTO> GetBookmarkByIdAsync(Guid id, string user)
    {
        Bookmark bookmark = await _bookmarksCollection.Find(item => item.User == user && item.id == id)
                                         .FirstOrDefaultAsync()
                                         .ContinueWith(item => item.Result);
        return bookmark.ToDTOFromDocument();
    }

    public async Task<List<ExistBookmarkDTO>> GetAllBookmarksByTagAsync(string user, List<string> tags)
    {
        FilterDefinition<Bookmark> filter = Builders<Bookmark>.Filter.AnyIn(bookmark => bookmark.Tags, tags);
        List<ExistBookmarkDTO> dtos = await _bookmarksCollection.Find(filter).ToListAsync()
                                                            .ContinueWith(item => item.Result.ConvertAll(item => item.ToDTOFromDocument()));
        return dtos;
    }

    public async Task<Guid> AddBookmarkAsync(NewBookmarkDTO item)
    {
        Bookmark bookmark = item.ToEntityNew();
        await _bookmarksCollection.InsertOneAsync(bookmark);
        return bookmark.id;
    }

    public async Task<bool> UpdateBookmarkAsync(UpdateBookmarkDTO dto)
    {
        FilterDefinition<Bookmark> filter = Builders<Bookmark>.Filter.Eq(bookmark => bookmark.id, dto.id);
        UpdateDefinition<Bookmark> update = Builders<Bookmark>.Update
                          .Set(bookmark => bookmark.Title, dto.title)
                          .Set(bookmark => bookmark.Url, dto.url)
                          .Set(bookmark => bookmark.Description, dto.description)
                          .Set(bookmark => bookmark.Tags, dto.tags);
        UpdateResult result = await _bookmarksCollection.UpdateOneAsync(filter, update);
        return result.IsAcknowledged;
    }

    public async Task<bool> DeleteBookmarkAsync(Guid id)
    {
        DeleteResult result = await _bookmarksCollection.DeleteOneAsync((item) => item.id == id);
        return result.IsAcknowledged;
    }
}
