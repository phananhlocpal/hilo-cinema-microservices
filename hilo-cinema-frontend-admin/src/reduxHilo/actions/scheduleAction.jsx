import axios from "axios";
import {
    FETCH_SCHEDULES_REQUEST, FETCH_SCHEDULES_SUCCESS,
    FETCH_SCHEDULES_FAILURE,
    FETCH_SCHEDULES_BY_MOVIEID_REQUEST,
    FETCH_SCHEDULES_BY_MOVIEID_SUCCESS,
    FETCH_SCHEDULES_BY_MOVIEID_FAILURE,
    FETCH_SEATS_BY_SCHEDULE_REQUEST,
    FETCH_SEATS_BY_SCHEDULE_SUCCESS,
    FETCH_SEATS_BY_SCHEDULE_FAILURE,
    CLEAR_SCHEDULES
} from "../types/type";

export const fetchSchedulesRequest = () => ({
    type: FETCH_SCHEDULES_REQUEST
});

export const fetchSchedulesSuccess = (schedules) => {
    return {
        type: FETCH_SCHEDULES_SUCCESS,
        payload: schedules
    };
};

export const fetchSchedulesFailure = (error) => ({
    type: FETCH_SCHEDULES_FAILURE,
    payload: error.message || error.toString()
});

export const fetchSchedules = () => {
    return (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const sysRole = state.auth.user ? state.auth.user.sysRole : null;

        dispatch(fetchSchedulesRequest());

        return axios.get("http://localhost:8000/ScheduleService", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Site-Type': sysRole || 'default',
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data)
                dispatch(fetchSchedulesSuccess(response.data));
            })
            .catch(error => {
                console.error("There was an error!", error.message);
                if (error.response && error.response.status === 401) {
                    dispatch(fetchSchedulesFailure("Unauthorized access"));
                } else if (error.response && error.response.status === 403) {
                    dispatch(fetchSchedulesFailure("Forbidden access"));
                } else {
                    dispatch(fetchSchedulesFailure(error));
                }
            });
    };
};
//Get Movie
export const fetchSchedulesByMovieIdRequest = () => ({
    type: FETCH_SCHEDULES_BY_MOVIEID_REQUEST,
});

export const fetchSchedulesByMovieIdSuccess = (schedules) => {
    console.log("Fetched schedule:", schedules);
    return (
        {
            type: FETCH_SCHEDULES_BY_MOVIEID_SUCCESS,
            payload: schedules,
        }
    )
};

export const fetchSchedulesByMovieIdFailure = (error) => ({
    type: FETCH_SCHEDULES_BY_MOVIEID_FAILURE,
    payload: error.message || error.toString(),
});

export const fetchSchedulesByMovieId = (movieId) => {
    return (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const sysRole = state.auth.user ? state.auth.user.sysRole : null;
        dispatch(fetchSchedulesRequest());

        return axios.get(`http://localhost:8000/ScheduleService/ByMovieId/${movieId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Site-Type': sysRole || 'default',
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data)
                dispatch(fetchSchedulesByMovieIdSuccess(response.data));
            })
            .catch(error => {
                console.error("There was an error fetching schedules by movie ID!", error.message);
                if (error.response && error.response.status === 401) {
                    dispatch(fetchSchedulesByMovieIdFailure("Unauthorized access"));
                } else if (error.response && error.response.status === 403) {
                    dispatch(fetchSchedulesByMovieIdFailure("Forbidden access"));
                } else {
                    dispatch(fetchSchedulesByMovieIdFailure(error));
                }
            });
    };
};
export const clearSchedules = () => ({
    type: CLEAR_SCHEDULES
});

//GetSeatByScheudle
export const fetchSeatsByScheduleRequest = () => ({
    type: FETCH_SEATS_BY_SCHEDULE_REQUEST,
});

export const fetchSeatsByScheduleSuccess = (seats) => ({
    type: FETCH_SEATS_BY_SCHEDULE_SUCCESS,
    payload: seats,
});

export const fetchSeatsByScheduleFailure = (error) => ({
    type: FETCH_SEATS_BY_SCHEDULE_FAILURE,
    payload: error.message || error.toString(),
});

export const fetchSeatsBySchedule = (movieId, date, theaterId, roomId, time) => {
    return (dispatch, getState) => {
        const state = getState();
        const token = state.auth.token;
        const sysRole = state.auth.user ? state.auth.user.sysRole : null;

        dispatch(fetchSeatsByScheduleRequest());

        return axios.get(`http://localhost:8000/ScheduleService/getSeatsBySchedule`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Site-Type': sysRole || 'default',
                'Content-Type': 'application/json'
            },
            params: {
                movieId,
                date,
                theaterId,
                roomId,
                time,
            }
        })
            .then(response => {
                dispatch(fetchSeatsByScheduleSuccess(response.data));
            })
            .catch(error => {
                console.error("There was an error fetching seats by schedule!", error.message);
                if (error.response && error.response.status === 401) {
                    dispatch(fetchSeatsByScheduleFailure("Unauthorized access"));
                } else if (error.response && error.response.status === 403) {
                    dispatch(fetchSeatsByScheduleFailure("Forbidden access"));
                } else {
                    dispatch(fetchSeatsByScheduleFailure(error));
                }
            });
    };
};