import axios from 'axios';

export const FETCH_MOVIE_REQUEST = 'FETCH_MOVIE_REQUEST';
export const FETCH_MOVIE_SUCCESS = 'FETCH_MOVIE_SUCCESS';
export const FETCH_MOVIE_FAILURE = 'FETCH_MOVIE_FAILURE';
export const FETCH_ALL_MOVIE_REQUEST = 'FETCH_ALL_MOVIE_REQUEST';
export const FETCH_ALL_MOVIE_SUCCESS = 'FETCH_ALL_MOVIE_SUCCESS';
export const FETCH_ALL_MOVIE_FAILURE = 'FETCH_ALL_MOVIE_FAILURE';

export const fetchMovie = (movieUrl) => async (dispatch) => {
    dispatch({ type: FETCH_MOVIE_REQUEST });
    try {
        const response = await axios.get(`http://localhost:8000/MovieService/url/${movieUrl}`);
        dispatch({ type: FETCH_MOVIE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_MOVIE_FAILURE, error: error.message });
    }
};

export const fetchAllMovies = () => async (dispatch) => {
    dispatch({ type: FETCH_ALL_MOVIE_REQUEST });
    try {
        const response = await axios.get('http://localhost:8000/MovieService');
        dispatch({ type: FETCH_ALL_MOVIE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_ALL_MOVIE_FAILURE, error: error.message });
    }
}