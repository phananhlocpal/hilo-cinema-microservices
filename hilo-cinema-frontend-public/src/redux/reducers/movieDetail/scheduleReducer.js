import {
    FETCH_SCHEDULE_REQUEST,
    FETCH_SCHEDULE_SUCCESS,
    FETCH_SCHEDULE_FAILURE
} from '../../actions/movieDetail/scheduleAction';

const initialState = {
    loading: false,
    schedule: [],
    error: ''
};

const scheduleReducer = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
        case FETCH_SCHEDULE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_SCHEDULE_SUCCESS:
            return {
                ...state,
                loading: false,
                schedule: action.payload,
                error: ''
            };
        case FETCH_SCHEDULE_FAILURE:
            return {
                ...state,
                loading: false,
                schedule: [],
                error: action.error
            };
        default:
            return state;
    }
};

export default scheduleReducer;