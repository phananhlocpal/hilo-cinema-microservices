import axios from "axios";
import {
  FETCH_THEATERS_REQUEST, FETCH_THEATERS_SUCCESS,
  FETCH_THEATERS_FAILURE,
  EDIT_THEATERS_SUCCESS, EDIT_THEATERS_FAILURE,
  ADD_THEATERS_SUCCESS, ADD_THEATERS_FAILURE,
  HIDDEN_THEATERS_SUCCESS, HIDDEN_THEATERS_FAILURE,
  FETCH_THEATERS_COUNT_SUCCESS, FETCH_THEATERS_COUNT_FAILURE
} from "../types/type";

export const fetchTheatersRequest = () => ({
  type: FETCH_THEATERS_REQUEST
});

export const fetchTheatersSuccess = (theater) => {
    console.log("Fetched theaters:", theater);  // Thêm dòng này để kiểm tra dữ liệu
    return {
      type: FETCH_THEATERS_SUCCESS,
      payload: theater
    };
  };
  

export const fetchTheatersFailure = (error) => ({
  type: FETCH_THEATERS_FAILURE,
  payload: error.message || error.toString()
});

export const fetchTheaters = () => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    dispatch(fetchTheatersRequest());

    return axios.get("http://localhost:8000/TheaterService", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(fetchTheatersSuccess(response.data));
      })
      .catch(error => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(fetchTheatersFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(fetchTheatersFailure("Forbidden access"));
        } else {
          dispatch(fetchTheatersFailure(error));
        }
      });
  };
};

// Edit Theater
export const editTheaterSuccess = (theater) => ({
  type: EDIT_THEATERS_SUCCESS,
  payload: theater,
});

export const editTheaterFailure = (error) => ({
  type: EDIT_THEATERS_FAILURE,
  payload: error.message || error.toString(),
});

export const editTheater = (id, theaterData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.put(`http://localhost:8000/TheaterService/${id}`, theaterData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        dispatch(editTheaterSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(editTheaterFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(editTheaterFailure("Forbidden access"));
        } else {
          dispatch(editTheaterFailure(error));
        }
      });
  };
};

export const fetchTheaterDetails = (id) => {
  return (dispatch) => {
    return axios.get(`http://localhost:8000/TheaterService/${id}`)
      .then(response => {
        dispatch(fetchTheatersSuccess([response.data])); // You can adjust this based on your needs
      })
      .catch(error => {
        console.error("There was an error fetching theater details!", error);
        dispatch(fetchTheatersFailure(error));
      });
  };
};

// Add Theater
export const addTheaterSuccess = (theater) => ({
  type: ADD_THEATERS_SUCCESS,
  payload: theater,
});

export const addTheaterFailure = (error) => ({
  type: ADD_THEATERS_FAILURE,
  payload: error.message || error.toString(),
});

export const addTheater = (theaterData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.post("http://localhost:8000/TheaterService", theaterData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        dispatch(addTheaterSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(addTheaterFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(addTheaterFailure("Forbidden access"));
        } else {
          dispatch(addTheaterFailure(error));
        }
      });
  };
};

//Hide Theater
export const hiddenTheaterSuccess = (theater) => ({
  type: HIDDEN_THEATERS_SUCCESS,
  payload: theater,
});

export const hiddenTheaterFailure = (error) => ({
  type: HIDDEN_THEATERS_FAILURE,
  payload: error.message || error.toString(),
});

export const hiddenTheater = (id) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.put(`http://localhost:8000/TheaterService/${id}/disable`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        dispatch(hiddenTheaterSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(hiddenTheaterFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(hiddenTheaterFailure("Forbidden access"));
        } else {
          dispatch(hiddenTheaterFailure(error));
        }
      });
  };
};
//Total Phim
// export const fetchTHEATERSCountSuccess = (count) => ({
//   type: FETCH_THEATERS_COUNT_SUCCESS,
//   payload: count,
// });

// export const fetchTHEATERSCountFailure = (error) => ({
//   type: FETCH_THEATERS_COUNT_FAILURE,
//   payload: error.message || error.toString(),
// });

// export const fetchTHEATERSCount = () => {
//   return async (dispatch, getState) => {
//     try {
//       const state = getState();
//       const token = state.auth.token;

//       const response = await axios.get('https://localhost:5001/api/THEATERS/Count', {
//         headers: {
//           'Authorization': `Bearer ${token}`,  // Thêm token vào header của yêu cầu
//         },
//       });
//       dispatch(fetchTHEATERSCountSuccess(response.data));
//     } catch (error) {
//       dispatch(fetchTHEATERSCountFailure(error));
//     }
//   };
// };
