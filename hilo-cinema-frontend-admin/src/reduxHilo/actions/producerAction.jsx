import axios from "axios";
import {
  FETCH_ACTORS_REQUEST, FETCH_ACTORS_SUCCESS,
  FETCH_ACTORS_FAILURE,
  EDIT_ACTORS_SUCCESS, EDIT_ACTORS_FAILURE,
  ADD_ACTORS_SUCCESS, ADD_ACTORS_FAILURE,
  HIDDEN_ACTORS_SUCCESS, HIDDEN_ACTORS_FAILURE,
  FETCH_ACTORS_COUNT_SUCCESS, FETCH_ACTORS_COUNT_FAILURE
} from "../types/type";

export const fetchProducersRequest = () => ({
  type: FETCH_ACTORS_REQUEST
});

export const fetchProducersSuccess = (actors) => ({
  type: FETCH_ACTORS_SUCCESS,
  payload: actors
});

export const fetchProducersFailure = (error) => ({
  type: FETCH_ACTORS_FAILURE,
  payload: error.message || error.toString()
});

export const fetchProducers = () => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    dispatch(fetchProducersRequest());

    return axios.get("http://localhost:8000/ActorService", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(fetch(response.data));
      })
      .catch(error => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(fetchActorsFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(fetchActorsFailure("Forbidden access"));
        } else {
          dispatch(fetchActorsFailure(error));
        }
      });
  };
};

// Edit Actor
export const editActorSuccess = (actor) => ({
  type: EDIT_ACTORS_SUCCESS,
  payload: actor,
});

export const editActorFailure = (error) => ({
  type: EDIT_ACTORS_FAILURE,
  payload: error.message || error.toString(),
});

export const editActor = (id, actorData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.put(`http://localhost:8000/ActorService/${id}`, actorData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'multipart/form-data'
      },
    })
      .then((response) => {
        dispatch(editActorSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(editActorFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(editActorFailure("Forbidden access"));
        } else {
          dispatch(editActorFailure(error));
        }
      });
  };
};

export const fetchActorById = (id) => {
  return (dispatch) => {
    return axios.get(`http://localhost:8000/ActorService/${id}`)
      .then(response => {
        dispatch(fetchActorsSuccess(response.data)); // You can adjust this based on your needs
      })
      .catch(error => {
        console.error("There was an error fetching actor details!", error);
        dispatch(fetchActorsFailure(error));
      });
  };
};

// Add Actor
export const addActorSuccess = (actor) => ({
  type: ADD_ACTORS_SUCCESS,
  payload: actor,
});

export const addActorFailure = (error) => ({
  type: ADD_ACTORS_FAILURE,
  payload: error.message || error.toString(),
});

export const addActor = (actorData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.post("http://localhost:8000/ActorService", actorData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'multipart/form-data'
      },
    })
      .then((response) => {
        dispatch(addActorSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(addActorFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(addActorFailure("Forbidden access"));
        } else {
          dispatch(addActorFailure(error));
        }
      });
  };
};

//Hide Actor
export const hiddenActorSuccess = (actor) => ({
  type: HIDDEN_ACTORS_SUCCESS,
  payload: actor,
});

export const hiddenActorFailure = (error) => ({
  type: HIDDEN_ACTORS_FAILURE,
  payload: error.message || error.toString(),
});

export const hiddenActor = (id) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.put(`http://localhost:8000/ActorService/${id}/disable`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        dispatch(hiddenActorSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(hiddenActorFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(hiddenActorFailure("Forbidden access"));
        } else {
          dispatch(hiddenActorFailure(error));
        }
      });
  };
};

//GetActorByMovieId
export const fetchActorsByMovieIdSuccess = (actors) => ({
  type: FETCH_ACTORS_SUCCESS,
  payload: actors
});

export const fetchActorsByMovieIdFailure = (error) => ({
  type: FETCH_ACTORS_FAILURE,
  payload: error.message || error.toString()
});

export const fetchActorsByMovieId = (movieId) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    dispatch(fetchActorsRequest());

    return axios.get(`http://localhost:8000/ActorService/GetActorByMovieId/${movieId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(fetchActorsByMovieIdSuccess(response.data));
      })
      .catch(error => {
        console.error("There was an error fetching actors by movie id!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(fetchActorsByMovieIdFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(fetchActorsByMovieIdFailure("Forbidden access"));
        } else {
          dispatch(fetchActorsByMovieIdFailure(error));
        }
      });
  };
};
