using MovieService.Models;

namespace MovieService.Data.ActorData
{
    public interface IActorRepo
    {
        Task<IEnumerable<Actor>> GetAllAsync();
        Task<Actor> GetByIdAsync(int id);
        Task InsertAsync(Actor actor, List<int> movieIds);
        Task UpdateAsync(Actor actor, List<int> movieIds);
        Task<IEnumerable<Actor>> GetActorsByMovieIdAsync(int movieId);
        Task HideActor(int id);
        Task<int> CountAsync();
    }
}
