// reducers/movieReducer.js
import { 
    FETCH_MOVIE_REQUEST, FETCH_MOVIE_SUCCESS, FETCH_MOVIE_FAILURE,
    FETCH_ALL_MOVIE_FAILURE, FETCH_ALL_MOVIE_REQUEST, FETCH_ALL_MOVIE_SUCCESS } from '../actions/movieAction';

const initialState = {
    movie: null,
    movies: [],
    loading: false,
    error: null,
};

const movieReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MOVIE_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_MOVIE_SUCCESS:
            return { ...state, movie: action.payload, loading: false };
        case FETCH_MOVIE_FAILURE:
            return { ...state, error: action.error, loading: false };
        case FETCH_ALL_MOVIE_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_ALL_MOVIE_SUCCESS:
            return { ...state, movies: action.payload, loading: false };
        case FETCH_ALL_MOVIE_FAILURE:
            return { ...state, error: action.error, loading: false };
        default:
            return state;
    }
};

export default movieReducer;
