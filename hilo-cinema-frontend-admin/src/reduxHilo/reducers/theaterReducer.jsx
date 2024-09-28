import {
    FETCH_THEATERS_REQUEST, FETCH_THEATERS_SUCCESS,
    FETCH_THEATERS_FAILURE,
    EDIT_THEATERS_SUCCESS, EDIT_THEATERS_FAILURE,
    ADD_THEATERS_SUCCESS, ADD_THEATERS_FAILURE,
    HIDDEN_THEATERS_SUCCESS, HIDDEN_THEATERS_FAILURE,
    FETCH_THEATERS_COUNT_SUCCESS, FETCH_THEATERS_COUNT_FAILURE
  } from "../types/type";

const initialState = {
    loading: false,
    theaters: [],
    count: 0,
    error: null
};

const theaterReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_THEATERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_THEATERS_SUCCESS:
            return {
                ...state,
                loading: false,
                theaters: action.payload,
            };
        case FETCH_THEATERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case EDIT_THEATERS_SUCCESS:
            return {
                ...state,
                loading: false, // Ensure loading is set to false after edit
                theaters: state.theaters.map((theater) =>
                    theater.id === action.payload.id ? action.payload : theater
                ),
            };
        case EDIT_THEATERS_FAILURE:
            return {
                ...state,
                loading: false, // Ensure loading is set to false after failure
                error: action.payload,
            };
        case ADD_THEATERS_SUCCESS:
            return {
                ...state,
            theaters: [...state.theaters, action.payload], // Thêm phim mới vào danh sách
        
            };
        case ADD_THEATERS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case HIDDEN_THEATERS_SUCCESS:
            return {
                ...state,
                theaters: state.theaters.filter(theater => theater.id !== action.payload.id),  // Loại bỏ phim đã ẩn khỏi danh sách
            };
        case HIDDEN_THEATERS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        // case FETCH_THEATERS_COUNT_SUCCESS:
        //     return {
        //         ...state,
        //         count: action.payload,  // Cập nhật count khi fetch thành công
        //     };
        // case FETCH_THEATERS_COUNT_FAILURE:
        //     return {
        //         ...state,
        //         error: action.payload,
        //     };
        default:
            return state;
    }
};

export default theaterReducer;
