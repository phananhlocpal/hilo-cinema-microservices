// reducers/movieReducer.js
import { FETCH_MOVIE_REQUEST, FETCH_MOVIE_SUCCESS, FETCH_MOVIE_FAILURE } from '../../actions/movieDetail/movieDetailAction';

const initialState = {
    movie: null,
    loading: false,
    error: null,
};

const movieDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MOVIE_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_MOVIE_SUCCESS:
            return { ...state, movie: action.payload, loading: false };
        case FETCH_MOVIE_FAILURE:
            return { ...state, error: action.error, loading: false };
        default:
            return state;
    }
};

export default movieDetailReducer;
