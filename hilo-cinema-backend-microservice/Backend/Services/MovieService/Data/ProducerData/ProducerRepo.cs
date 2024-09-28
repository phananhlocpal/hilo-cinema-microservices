using Microsoft.EntityFrameworkCore;
using MovieService.Models;
using System;

namespace MovieService.Data.ProducerData
{
    public class ProducerRepo : IProducerRepo
    {
        private readonly MovieContext _context;

        public ProducerRepo(MovieContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Producer>> GetAllAsync()
        {
            return await _context.Producers.ToListAsync();
        }

        public async Task<Producer> GetByIdAsync(int id)
        {
            return await _context.Producers.FindAsync(id);
        }

        public async Task InsertAsync(Producer producer, List<int> movieIds)
        {
            await _context.Producers.AddAsync(producer);
            await _context.SaveChangesAsync(); // Lưu Actor trước để lấy Id

            // Thêm liên kết giữa Actor và Movies
            foreach (var movieId in movieIds)
            {
                var movie = await _context.Movies.FindAsync(movieId);
                if (movie != null)
                {
                    producer.Movies.Add(movie);  // Thêm movie vào collection của actor
                }
            }
            await _context.SaveChangesAsync();  // Lưu thay đổi vào bảng movie_actor
        }



        public async Task UpdateAsync(Producer producer, List<int> movieIds)
        {
            var existingActor = await _context.Actors
                .Include(a => a.Movies)
                .FirstOrDefaultAsync(a => a.Id == producer.Id);

            if (existingActor != null)
            {
                // Cập nhật các thuộc tính của actor
                _context.Entry(existingActor).CurrentValues.SetValues(producer);

                // Cập nhật liên kết với các movie
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
        public async Task<IEnumerable<Producer>> GetProducersByMovieIdAsync(int movieId)
        {
            return await _context.Producers
                .Where(producer => producer.Movies.Any(m => m.Id == movieId))
                .ToListAsync();
        }
        public async Task HiddenProducerAsync(int id)
        {
            var producer = await GetByIdAsync(id);
            if (producer != null)
            {
                // Giả sử Producer có thuộc tính Status để xác định xem nó có ẩn hay không
                producer.Status = "Inactive";  // hoặc cách xử lý ẩn tương tự
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> CountAsync()
        {
            return await _context.Producers.CountAsync();
        }
    }
}