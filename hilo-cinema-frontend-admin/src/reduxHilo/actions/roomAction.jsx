import axios from "axios";
import { 
  FETCH_ROOMS_REQUEST, FETCH_ROOMS_SUCCESS, 
  FETCH_ROOMS_FAILURE,
  EDIT_ROOMS_SUCCESS, EDIT_ROOMS_FAILURE,
  ADD_ROOMS_SUCCESS, ADD_ROOMS_FAILURE
} from "../types/type";

export const fetchRoomsRequest = () => ({
  type: FETCH_ROOMS_REQUEST
});

export const fetchRoomsSuccess = (rooms) => ({
  type: FETCH_ROOMS_SUCCESS,
  payload: rooms
});

export const fetchRoomsFailure = (error) => ({
  type: FETCH_ROOMS_FAILURE,
  payload: error.message || error.toString()
});

export const fetchRooms = () => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;
    console.log(sysRole)
    dispatch(fetchRoomsRequest());

    return axios.get("http://localhost:8000/RoomService", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',  // Gửi Site-Type trong header
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(fetchRoomsSuccess(response.data));
      })
      .catch(error => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(fetchRoomsFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(fetchRoomsFailure("Forbidden access"));
        } else {
          dispatch(fetchRoomsFailure(error));
        }
      });
  };
};

// Edit room
export const editRoomSuccess = (room) => ({
  type: EDIT_ROOMS_SUCCESS,
  payload: room,
});

export const editRoomFailure = (error) => ({
  type: EDIT_ROOMS_FAILURE,
  payload: error.message || error.toString(),
});

export const editRoom = (id, roomData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.put(`http://localhost:8000/RoomService/${id}`, roomData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',  // Gửi Site-Type trong header
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(editRoomSuccess(response.data));
      })
      .catch(error => {
        dispatch(editRoomFailure(error));
      });
  };
};

// Add room
export const addRoomSuccess = (room) => ({
  type: ADD_ROOMS_SUCCESS,
  payload: room,
});

export const addRoomFailure = (error) => ({
  type: ADD_ROOMS_FAILURE,
  payload: error.message || error.toString(),
});

export const addRoom = (roomData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    return axios.post("http://localhost:8000/RoomService", roomData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',  // Gửi Site-Type trong header
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(addRoomSuccess(response.data));
      })
      .catch(error => {
        dispatch(addRoomFailure(error));
      });
  };
};

//GetRoomByTheaterId
export const fetchRoomsByTheaterId = (theaterId) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    dispatch(fetchRoomsRequest());

    return axios.get(`http://localhost:8000/RoomService/GetRoomByTheater/${theaterId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(fetchRoomsSuccess(response.data));
      })
      .catch(error => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(fetchRoomsFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(fetchRoomsFailure("Forbidden access"));
        } else {
          dispatch(fetchRoomsFailure(error));
        }
      });
  };
};
