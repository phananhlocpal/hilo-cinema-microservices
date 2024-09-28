// Import libraries
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

// Import components
import Schedule from "../components/movieDetail_components/Schedule";
import MovieChooseDateComponent from "../components/movieDetail_components/MovieChooseDateComponent";
import MovieContent from "../components/movieDetail_components/MovieContent.jsx";
import MovieOverviewComponent from "../components/movieDetail_components/MovieOverviewComponent.jsx";
import MovieSuggestionComponent from "../components/common_components/MovieSuggestionComponent.jsx";

// Import action
import { fetchMovie } from '../redux/actions/movieDetail/movieDetailAction.js';
import { CircularProgress } from '@mui/material';

const FilmDetail = () => {
    const { movieUrl } = useParams();
    const dispatch = useDispatch();
    const { movie, loading, error } = useSelector((state) => state.movieDetail);
    const { schedule } = useSelector((state) => state.schedule);
    const [selectedDate, setSelectedDate] = useState('');
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchMovie(movieUrl));
                setDataLoaded(true);
            } catch (err) {
                console.error("Error fetching movie:", err);
                setDataLoaded(false);
            }
        };

        fetchData();
    }, [dispatch, movieUrl]);

    useEffect(() => {
        if (schedule && schedule.length > 0) {
            setSelectedDate(schedule[0].date);
        }
        console.log(schedule)
    }, [schedule]);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    if (loading) return (
        <div className="w-full h-[calc(100vh-120px)] flex justify-center items-center">
            <CircularProgress style={{width: "100px", height: "100px"}} />
        </div>
    );
    if (error) return <p>Error loading movie details</p>;

    return (
        <div>
            <div className="book__ticket__wrapper">
                <div className="relative bg-black flex justify-center w-full h-full">
                    {/* Movie Image and Play Button */}
                    <div className="relative h-full">
                        <img
                            alt="Img Movie"
                            loading="lazy"
                            className="w-[860px] h-full md:h-full lg:h-[500px] object-fill"
                            src={movie?.imgLarge ? `data:image/jpeg;base64,${movie.imgLarge}` : 'https://via.placeholder.com/1440x440'}
                        />
                        <button className="absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4 z-[600]">
                            <img
                                alt="play"
                                loading="lazy"
                                className="w-[40px] h-[40px] lg:w-[64px] lg:h-[64px] object-cover"
                                src="https://www.galaxycine.vn/_next/static/media/button-play.2f9c0030.png"
                            />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 screen1200:grid-cols-7 my-0 mx-auto screen1390:max-w-screen-xl xl:max-w-screen-screen1200 lg:max-w-4xl md:max-w-4xl gap-8 py-7 md:px-4 px-4">
                    <div className="book__left lg:col-span-5 w-full ">
                        <div className="book__film flex flex-col">
                            {dataLoaded && (
                                <>
                                    <MovieOverviewComponent movie={movie} />
                                    <MovieContent movieModel={movie} />
                                </>
                            )}
                            <div className="movie__showtime">
                                <div className="movie__showtime-header">
                                    <span className="border-l-4 border-solid border-blue-10 mr-2"></span>
                                    <h1 className="mb-4 text-base inline-block capitalize font-bold">Lịch chiếu</h1>
                                </div>
                                {dataLoaded && movie && (
                                    <Schedule movie={movie} />
                                )}
                            </div>
                        </div>
                    </div>
                    <MovieSuggestionComponent />
                </div>
            </div>
        </div>
    );
};

export default FilmDetail;