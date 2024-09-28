import axios from "axios";
import {
    FETCH_SEATS_REQUEST, FETCH_SEATS_SUCCESS,
    FETCH_SEATS_FAILURE,
    ADD_SEATS_SUCCESS, ADD_SEATS_FAILURE, EDIT_SEATS_SUCCESS, EDIT_SEATS_FAILURE
} from "../types/type";
export const fetchSeatsRequest = () => ({
    type: FETCH_SEATS_REQUEST
});

export const fetchSeatsSuccess = (customers) => ({
    type: FETCH_SEATS_SUCCESS,
    payload: customers
});

export const fetchSeatsFailure = (error) => ({
    type: FETCH_SEATS_FAILURE,
    payload: error.message || error.toString()
});

export const fetchSeats = () => {
    return (dispatch) => {
        dispatch(fetchSeatsRequest());
        return axios.get("http://localhost:8000/SeatService")
            .then(response => {
                dispatch(fetchSeatsSuccess(response.data));
            })
            .catch(error => {
                console.error("There was an error!", error);
                dispatch(fetchSeatsFailure(error));
            });
    };
};
export const fetchSeatsByRoom = (roomId) => {
  return (dispatch) => {
    // Reset lỗi khi bắt đầu fetch ghế mới
    dispatch(fetchSeatsRequest());

    return axios
      .get(`http://localhost:8000/SeatService/GetSeatsByRoom/${roomId}`)
      .then((response) => {
        dispatch(fetchSeatsSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error);
        if (error.response && error.response.status === 404) {
          dispatch(fetchSeatsFailure("This room does not have seats, please add more seats"));
        } else {
          dispatch(fetchSeatsFailure(error.message || "Có lỗi xảy ra"));
        }
      });
  };
};

//Edit Seat
export const editSeatSuccess = (seat) => ({
  type: EDIT_SEATS_SUCCESS,
  payload: seat,
});

export const editSeatFailure = (error) => ({
  type: EDIT_SEATS_FAILURE,
  payload: error.message || error.toString(),
});

export const editSeat = (id, seatData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.put(`http://localhost:8000/SeatService/${id}`, seatData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        dispatch(editSeatSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(editSeatFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(editSeatFailure("Forbidden access"));
        } else {
          dispatch(editSeatFailure(error));
        }
      });
  };
};
export const fetchSeatById = (id) => {
  return (dispatch) => {
    return axios.get(`http://localhost:8000/SeatService/${id}`)
      .then(response => {
        dispatch(fetchSeatsSuccess(response.data)); // You can adjust this based on your needs
      })
      .catch(error => {
        console.error("There was an error fetching Seat details!", error);
        dispatch(fetchSeatsFailure(error));
      });
  };
};
//Add
export const addSeatSuccess = (seat) => ({
    type: ADD_SEATS_SUCCESS,
    payload: seat,
});

export const addSeatFailure = (error) => ({
    type: ADD_SEATS_FAILURE,
    payload: error.message || error.toString(),
});

export const addSeat = (seatData) => {
    return (dispatch) => {
        return axios.post("http://localhost:8000/SeatService", seatData)
            .then(response => {
                dispatch(addSeatSuccess(response.data));
            })
            .catch(error => {
                dispatch(addSeatFailure(error));
            });
    };
};
export const saveSeats = (seats) => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    try {
      const seatData = seats.map(seat => ({
        roomId: seat.roomId,
        colSeat: seat.colSeat,
        rowSeat: seat.rowSeat,
        name: seat.name,
        type: seat.type || 'standard',
        status: seat.status || 'available'
      }));

      console.log(seatData)
      
      const response = await axios.post("http://localhost:8000/SeatService", seatData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Site-Type': sysRole || 'default',
          'Content-Type': 'application/json',
        },
      });

      dispatch({
        type: ADD_SEATS_SUCCESS,
        payload: response.data,
      });

      return Promise.resolve(response.data); // Trả về thành công
    } catch (error) {
      console.error("There was an error saving seats!", error.message);

      if (error.response && error.response.status === 401) {
        dispatch({
          type: ADD_SEATS_FAILURE,
          payload: "Unauthorized access",
        });
      } else if (error.response && error.response.status === 403) {
        dispatch({
          type: ADD_SEATS_FAILURE,
          payload: "Forbidden access",
        });
      } else {
        dispatch({
          type: ADD_SEATS_FAILURE,
          payload: error.response?.data || error.message || error.toString(),
        });
      }

      return Promise.reject(error); // Trả về lỗi
    }
  };
};
