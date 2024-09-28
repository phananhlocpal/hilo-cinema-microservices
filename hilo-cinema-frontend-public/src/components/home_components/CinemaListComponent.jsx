import MovieCardItem from '../common_components/comom_item/MovieCardItem.jsx';
import { useSelector } from 'react-redux';

const CinemaListComponent = () => {
  const tabValue = useSelector((state) => state.home.tabValue);
  const recentMovieList = useSelector((state) => state.home.recentMovieList);
  const upcommingMovieList = useSelector((state) => state.home.upcommingMovieList);

  const selectedList = tabValue === 1 ? upcommingMovieList : recentMovieList;

  return (
    <div className='pt-5 flex justify-center items-center'>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-x-10 gap-y-6 mb-10'>
        {selectedList.map(({ id, title, movieUrl, imgSmall , trailer}) => (
          <MovieCardItem
            key={id}
            title={title}
            imageUrl={imgSmall}
            href={movieUrl}
            widthCard="250px"
            heightCard="400px"
            trailer={trailer}
          />
        ))}
      </div>
    </div>
  );
};

export default CinemaListComponent;
