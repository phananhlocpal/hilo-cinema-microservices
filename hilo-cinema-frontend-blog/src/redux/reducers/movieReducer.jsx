// src/redux/movie/movieReducer.js
import {
    FETCH_MOVIES_REQUEST,
    FETCH_MOVIES_SUCCESS,
    FETCH_MOVIES_FAILURE
} from '../actionTypes';

const initialState = {
    loading: false,
    movies: [],
    error: ''
};

const movieReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MOVIES_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_MOVIES_SUCCESS:
            return {
                loading: false,
                movies: action.payload,
                error: ''
            };
        case FETCH_MOVIES_FAILURE:
            return {
                loading: false,
                movies: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default movieReducer;
