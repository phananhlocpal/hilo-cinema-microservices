
using Microsoft.EntityFrameworkCore;
using MovieService.Models;
using System;

namespace MovieService.Data.ActorData
{
    public class ActorRepo : IActorRepo
    {
        private readonly MovieContext _context;

        public ActorRepo(MovieContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Actor>> GetAllAsync()
        {
            return await _context.Actors.ToListAsync();
        }

        public async Task<Actor> GetByIdAsync(int id)
        {
            return await _context.Actors.FindAsync(id);
        }

        public async Task InsertAsync(Actor actor, List<int> movieIds)
        {
            await _context.Actors.AddAsync(actor);
            await _context.SaveChangesAsync();

            foreach (var movieId in movieIds)
            {
                var movie = await _context.Movies.FindAsync(movieId);
                if (movie != null)
                {
                    actor.Movies.Add(movie);
                }
            }
            await _context.SaveChangesAsync();
        }



        public async Task UpdateAsync(Actor actor, List<int> movieIds)
        {
            var existingActor = await _context.Actors
                .Include(a => a.Movies)
                .FirstOrDefaultAsync(a => a.Id == actor.Id);

            if (existingActor != null)
            {
                _context.Entry(existingActor).CurrentValues.SetValues(actor);

                existingActor.Movies.Clear();
                foreach (var movieId in movieIds)
                {
                    var movie = await _context.Movies.FindAsync(movieId);
                    if (movie != null)
                    {
                        existingActor.Movies.Add(movie);
                    }
                }

                await _context.SaveChangesAsync();
            }
        }

        public async Task HideActor(int id)
        {
            var movie = await _context.Actors.FindAsync(id);
            if (movie != null)
            {
                movie.Status = "Inactive";
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Actor>> GetActorsByMovieIdAsync(int movieId)
        {
            return await _context.Actors
                .Where(actor => actor.Movies.Any(m => m.Id == movieId))
                .ToListAsync();
        }
        public async Task<int> CountAsync()
        {
            return await _context.Actors.CountAsync();
        }
    }
}
