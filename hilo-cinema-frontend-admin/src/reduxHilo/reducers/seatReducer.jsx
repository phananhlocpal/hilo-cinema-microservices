import {
    FETCH_SEATS_REQUEST, FETCH_SEATS_SUCCESS,
    FETCH_SEATS_FAILURE,
    ADD_SEATS_SUCCESS, ADD_SEATS_FAILURE,
    EDIT_SEATS_SUCCESS, EDIT_SEATS_FAILURE
} from "../types/type";

const initialState = {
    loading: false,
    seats: [],
    error: null
};

const seatReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SEATS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null, // Reset lỗi khi bắt đầu fetch mới
            };
        case FETCH_SEATS_SUCCESS:
            return {
                ...state,
                loading: false,
                seats: action.payload,
                error: null, // Reset lỗi nếu fetch thành công
            };
        case FETCH_SEATS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case ADD_SEATS_SUCCESS:
            return {
                ...state,
                seats: [...state.seats, action.payload],
            };
        case ADD_SEATS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case EDIT_SEATS_SUCCESS:
            return {
                ...state,
                seats: state.seats.map(seat =>
                    seat.id === action.payload.id ? action.payload : seat
                ),
            };
        case EDIT_SEATS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default seatReducer;
