using Microsoft.EntityFrameworkCore;
using MovieService.Models;
using System.Linq.Expressions;

namespace MovieService.Data.MovieData
{
    public interface IMovieRepo
    {
        Task<IEnumerable<Movie>> GetAllAsync(Expression<Func<Movie, bool>> predicate);
        Task<Movie> GetByIdAsync(int id);
        Task<Movie> GetByUrlAsync(string url);
        Task InsertAsync(Movie movie);
        Task UpdateAsync(Movie movie);
        Task DisableMovieAsync(int id);
        Task<int> GetMovieCountAsync();
        Task<bool> SaveChangesAsync();
    }
}
