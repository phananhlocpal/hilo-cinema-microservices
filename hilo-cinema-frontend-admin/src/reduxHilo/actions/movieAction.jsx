import axios from "axios";
import {
  FETCH_MOVIES_REQUEST, FETCH_MOVIES_SUCCESS,
  FETCH_MOVIES_FAILURE,
  EDIT_MOVIES_SUCCESS, EDIT_MOVIES_FAILURE,
  ADD_MOVIES_SUCCESS, ADD_MOVIES_FAILURE,
  HIDDEN_MOVIE_SUCCESS, HIDDEN_MOVIE_FAILURE,
  FETCH_MOVIES_COUNT_SUCCESS, FETCH_MOVIES_COUNT_FAILURE
} from "../types/type";

export const fetchMoviesRequest = () => ({
  type: FETCH_MOVIES_REQUEST
});

export const fetchMoviesSuccess = (movie) => {
  console.log("Fetched movie:", movie);  // Thêm dòng này để kiểm tra dữ liệu
  return {
    type: FETCH_MOVIES_SUCCESS,
    payload: movie
  };
};

export const fetchMoviesFailure = (error) => ({
  type: FETCH_MOVIES_FAILURE,
  payload: error.message || error.toString()
});

export const fetchMovies = () => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    dispatch(fetchMoviesRequest());

    return axios.get("http://localhost:8000/MovieService", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(fetchMoviesSuccess(response.data));
      })
      .catch(error => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(fetchMoviesSuccess("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(fetchMoviesFailure("Forbidden access"));
        } else {
          dispatch(fetchMoviesFailure(error));
        }
      });
  };
};

// Edit Movie
export const editMovieSuccess = (movie) => ({
  type: EDIT_MOVIES_SUCCESS,
  payload: movie,
});

export const editMovieFailure = (error) => ({
  type: EDIT_MOVIES_FAILURE,
  payload: error.message || error.toString(),
});

export const editMovie = (id, movieData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.put(`http://localhost:8000/MovieService/${id}`, movieData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        dispatch(editMovieSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(editMovieFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(editMovieFailure("Forbidden access"));
        } else {
          dispatch(editMovieFailure(error));
        }
      });
  };
};

export const fetchMovieDetails = (id) => {
  return (dispatch) => {
    return axios.get(`http://localhost:8000/MovieService/${id}`)
      .then(response => {
        dispatch(fetchMoviesSuccess([response.data])); // You can adjust this based on your needs
      })
      .catch(error => {
        console.error("There was an error fetching movie details!", error);
        dispatch(fetchMoviesFailure(error));
      });
  };
};

// Add Movie
export const addMovieSuccess = (movie) => ({
  type: ADD_MOVIES_SUCCESS,
  payload: movie,
});

export const addMovieFailure = (error) => ({
  type: ADD_MOVIES_FAILURE,
  payload: error.message || error.toString(),
});

export const addMovie = (movieData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.post("http://localhost:8000/MovieService", movieData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        dispatch(addMovieSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(addMovieFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(addMovieFailure("Forbidden access"));
        } else {
          dispatch(addMovieFailure(error));
        }
      });
  };
};

// Hidden Movie
export const hiddenMovieSuccess = (movie) => ({
  type: HIDDEN_MOVIE_SUCCESS,
  payload: movie,
});

export const hiddenMovieFailure = (error) => ({
  type: HIDDEN_MOVIE_FAILURE,
  payload: error.message || error.toString(),
});

export const hiddenMovie = (id) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.put(`http://localhost:8000/MovieService/${id}/disable`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        dispatch(hiddenMovieSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(hiddenMovieFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(hiddenMovieFailure("Forbidden access"));
        } else {
          dispatch(hiddenMovieFailure(error));
        }
      });
  };
};
//Total Phim
export const fetchMoviesCountSuccess = (count) => ({
  type: FETCH_MOVIES_COUNT_SUCCESS,
  payload: count,
});

export const fetchMoviesCountFailure = (error) => ({
  type: FETCH_MOVIES_COUNT_FAILURE,
  payload: error.message || error.toString(),
});

export const fetchMoviesCount = () => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const token = state.auth.token;

      const response = await axios.get('http://localhost:8000/MovieService/count', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Thêm token vào header của yêu cầu
        },
      });
      dispatch(fetchMoviesCountSuccess(response.data));
    } catch (error) {
      dispatch(fetchMoviesCountFailure(error));
    }
  };
};
