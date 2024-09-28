import {
    FETCH_MOVIES_REQUEST, FETCH_MOVIES_SUCCESS,
    FETCH_MOVIES_FAILURE,
    EDIT_MOVIES_SUCCESS, EDIT_MOVIES_FAILURE,
    ADD_MOVIES_SUCCESS, ADD_MOVIES_FAILURE,
    HIDDEN_MOVIE_SUCCESS, HIDDEN_MOVIE_FAILURE,
    FETCH_MOVIES_COUNT_SUCCESS,
    FETCH_MOVIES_COUNT_FAILURE,
} from "../types/type";

const initialState = {
    loading: false,
    movies: [],
    count: 0,
    error: null
};

const movieReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MOVIES_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_MOVIES_SUCCESS:
            return {
                ...state,
                loading: false,
                movies: action.payload,
            };
        case FETCH_MOVIES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case EDIT_MOVIES_SUCCESS:
            return {
                ...state,
                loading: false, // Ensure loading is set to false after edit
                movies: state.movies.map((mov) =>
                    mov.id === action.payload.id ? action.payload : mov
                ),
            };
        case EDIT_MOVIES_FAILURE:
            return {
                ...state,
                loading: false, // Ensure loading is set to false after failure
                error: action.payload,
            };
        case ADD_MOVIES_SUCCESS:
            return {
                ...state,
                movies: [...state.movies, action.payload], // Thêm phim mới vào danh sách
            };
        case ADD_MOVIES_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case HIDDEN_MOVIE_SUCCESS:
            return {
                ...state,
                movies: state.movies.filter(movie => movie.id !== action.payload.id),  // Loại bỏ phim đã ẩn khỏi danh sách
            };
        case HIDDEN_MOVIE_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case FETCH_MOVIES_COUNT_SUCCESS:
            return {
                ...state,
                count: action.payload,  // Cập nhật count khi fetch thành công
            };
        case FETCH_MOVIES_COUNT_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default movieReducer;
