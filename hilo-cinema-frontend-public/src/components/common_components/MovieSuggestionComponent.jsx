import MovieCardItem from './comom_item/MovieCardItem';
import { ExpandMore } from '@mui/icons-material';
import TitleItem from './comom_item/TitleItem';
import { useSelector } from 'react-redux';

const MovieSuggestionComponent = () => {
  const { movies } = useSelector(state => state.movies);
    const today = new Date();
    
    const filteredMovies = movies
        .filter(movie => movie.status === 'Active')
        .filter(movie => new Date(movie.releasedDate) <= today)
        .sort((a, b) => new Date(b.releasedDate) - new Date(a.releasedDate))
        .slice(0, 3);

  return (
    <div className="hidden screen1200:block lg:col-span-2 w-full overflow-hidden">
      <TitleItem title='PHIM ĐANG CHIẾU' />
      <div className="movie__content">
        <ul className="flex flex-col justify-between">
          {filteredMovies.map(movie => (
            <MovieCardItem
              key={movie.id}
              widthCard="400px"
              heightCard="250px"
              title={movie.title}
              imageUrl={movie.imgSmall}
              href={movie.movieUrl} // assuming there's a href in movie data
              trailer={movie.trailer} // assuming there's a trailer in movie data
              id={movie.id}
            />
          ))}
        </ul>
        <div className="text-end">
          <a
            type="button"
            className="text-[#f26b38] hover:text-white w-40 border border-[#fb9440] hover:bg-[#fb9440] transition-all duration-300 focus:ring-1 focus:outline-none focus:ring-[#fb9440] rounded text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#fb9440] dark:focus:ring-[#fb9440] mr-2 mb-2 justify-center"
            href="/phim-dang-chieu/"
          >
            Xem thêm
            <ExpandMore />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MovieSuggestionComponent;
