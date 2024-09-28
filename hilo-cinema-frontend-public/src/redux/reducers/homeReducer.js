
import { SET_TAB, SET_RECENT_MOVIES } from '../actions/homeAction.js';

const initialState = {
    tabValue: 0,
    recentMovieList: [],
    upcommingMovieList: [], 
    blogs: [],
};

const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CAROUSEL_IMAGES":
            return {
                ...state,
                carouselImages: action.payload,
            };
        case "SET_BLOGS":
            return {
                ...state,
                blogs: action.payload,
            };
        case "SET_PROMOTION_NEWS":
            return {
                ...state,
                blogs: action.payload,
            };
        case SET_TAB:
            return {
                ...state,
                tabValue: action.payload,
            };
        case SET_RECENT_MOVIES:
            return {
                ...state,
                recentMovieList: action.payload,
            };
        default:
            return state;
    }
};

export default homeReducer;