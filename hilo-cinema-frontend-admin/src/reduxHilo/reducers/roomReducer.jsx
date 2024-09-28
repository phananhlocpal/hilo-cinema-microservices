import {
    FETCH_ROOMS_REQUEST, FETCH_ROOMS_SUCCESS, 
    FETCH_ROOMS_FAILURE,
    EDIT_ROOMS_SUCCESS,EDIT_ROOMS_FAILURE,
    ADD_ROOMS_SUCCESS, ADD_ROOMS_FAILURE
} from "../types/type";

const initialState = {
    loading: false,
    rooms: [],
    error: null
};

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ROOMS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_ROOMS_SUCCESS:
            return {
                ...state,
                loading: false,
                rooms: action.payload
            };
        case FETCH_ROOMS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case EDIT_ROOMS_SUCCESS:
            return {
                ...state,
                rooms: state.rooms.map(room =>
                    room.id === action.payload.id ? action.payload : room
                ),
            };
        case EDIT_ROOMS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case ADD_ROOMS_SUCCESS:
            return {
                ...state,
                rooms: [...state.rooms, action.payload],
            };
        case ADD_ROOMS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default roomReducer;
