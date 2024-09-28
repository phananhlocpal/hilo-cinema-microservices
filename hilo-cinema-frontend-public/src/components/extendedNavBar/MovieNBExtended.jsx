import MovieCardItem from "../common_components/comom_item/MovieCardItem";
import { useSelector } from 'react-redux';

const MovieNBExtended = () => {
    const { movies } = useSelector(state => state.movies);
    console.log(movies);
    const filteredMovies = movies
        .filter(movie => movie.status === 'Active')
        .sort((a, b) => new Date(b.releasedDate) - new Date(a.releasedDate)).slice(0, 4);

    if (!filteredMovies) {
        return null;
    }

    return (
        <div className="absolute top-[65px] -left-[45px] hidden group-hover:md:block hover:md:block z-[800] transition-all duration-300 ease-in-out drop-shadow-lg">
            <div className="bg-white min-w-[250px] border border-white border-solid rounded px-6 py-4">
                <div className="movie__show">
                    <div>
                        <span className="border-l-4 border-solid border-blue-800 mr-2"></span>
                        <a className="mb-4 text-xl inline-block uppercase font-medium hover:text-blue-800" href="/phim-dang-chieu">
                            PHIM ĐANG CHIẾU
                        </a>
                    </div>
                    <ul className="flex flex-row gap-7 justify-between">
                        {filteredMovies.map((movie) => (
                            <MovieCardItem key={movie.id} title={movie.title} imageUrl={movie.imgSmall} href={movie.movieUrl} id={movie.id} trailer={movie.trailer} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MovieNBExtended;