using MovieService.Models;

namespace MovieService.Data.ProducerData
{
    public interface IProducerRepo
    {
        Task<IEnumerable<Producer>> GetAllAsync();
        Task<Producer> GetByIdAsync(int id);
        Task InsertAsync(Producer producer, List<int> movieIds);
        Task UpdateAsync(Producer producer, List<int> movieIds);
        Task<IEnumerable<Producer>> GetProducersByMovieIdAsync(int movieId);
        Task HiddenProducerAsync(int id);
        Task<int> CountAsync();
    }
}
