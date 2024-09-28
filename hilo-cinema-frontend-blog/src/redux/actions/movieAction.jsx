// src/redux/movie/movieActions.js
import callApi from '../../api/index'; 
import {
    FETCH_MOVIES_REQUEST,
    FETCH_MOVIES_SUCCESS,
    FETCH_MOVIES_FAILURE
} from '../actionTypes';

export const fetchMoviesRequest = () => {
    return {
        type: FETCH_MOVIES_REQUEST
    };
};

export const fetchMoviesSuccess = (movies) => {
    return {
        type: FETCH_MOVIES_SUCCESS,
        payload: movies
    };
};

export const fetchMoviesFailure = (error) => {
    return {
        type: FETCH_MOVIES_FAILURE,
        payload: error
    };
};

export const fetchMovies = (token) => {
    return (dispatch) => {
        dispatch(fetchMoviesRequest());
        callApi('api/movies', 'GET', null, token)
            .then(response => {
                dispatch(fetchMoviesSuccess(response));
            })
            .catch(error => {
                dispatch(fetchMoviesFailure(error.message));
            });
    };
};
