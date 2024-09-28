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

const initialState = {
    loading: false,
    schedules: [],
    seats: [],
    error: null,
};

const scheduleReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SCHEDULES_REQUEST:
        case FETCH_SCHEDULES_BY_MOVIEID_REQUEST:
        case FETCH_SEATS_BY_SCHEDULE_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case FETCH_SCHEDULES_SUCCESS:
            return {
                ...state,
                loading: false,
                schedules: action.payload,
            };

        case FETCH_SCHEDULES_FAILURE:
        case FETCH_SCHEDULES_BY_MOVIEID_FAILURE:
        case FETCH_SEATS_BY_SCHEDULE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case FETCH_SCHEDULES_BY_MOVIEID_SUCCESS:
            return {
                ...state,
                loading: false,
                schedules: action.payload,
            };

        case FETCH_SEATS_BY_SCHEDULE_SUCCESS:
            return {
                ...state,
                loading: false,
                seats: action.payload,
            };

        case CLEAR_SCHEDULES:
            return initialState;

        default:
            return state;
    }
};

export default scheduleReducer;
