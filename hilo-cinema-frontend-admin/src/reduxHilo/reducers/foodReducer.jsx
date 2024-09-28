import {
    FETCH_FOODS_REQUEST,
    FETCH_FOODS_SUCCESS,
    FETCH_FOODS_FAILURE,
    EDIT_FOOD_SUCCESS,
    EDIT_FOOD_FAILURE,
    ADD_FOOD_SUCCESS,
    ADD_FOOD_FAILURE,
    SEARCH_FOOD_BY_NAME_REQUEST,
    SEARCH_FOOD_BY_NAME_SUCCESS,
    SEARCH_FOOD_BY_NAME_FAILURE
  } from "../types/type";
  
  const initialState = {
    loading: false,
    foods: [], // Changed from 'actors' to 'foods'
    searchResults: [], // To store search results
    count: 0,
    error: null
  };
  
  const foodReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_FOODS_REQUEST:
      case SEARCH_FOOD_BY_NAME_REQUEST: // Handle search request similarly to fetch request
        return {
          ...state,
          loading: true,
          error: null, 
        };
      case FETCH_FOODS_SUCCESS:
        return {
          ...state,
          loading: false,
          foods: action.payload,
        };
      case FETCH_FOODS_FAILURE:
      case SEARCH_FOOD_BY_NAME_FAILURE: // Handle search failure similarly to fetch failure
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case EDIT_FOOD_SUCCESS:
        return {
          ...state,
          loading: false,
          foods: state.foods.map((food) =>
            food.id === action.payload.id ? action.payload : food
          ),
        };
      case EDIT_FOOD_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case ADD_FOOD_SUCCESS:
        return {
          ...state,
          foods: [...state.foods, action.payload],
        };
      case ADD_FOOD_FAILURE:
        return {
          ...state,
          error: action.payload,
        };
      case SEARCH_FOOD_BY_NAME_SUCCESS: 
        return {
          ...state,
          loading: false,
          searchResults: action.payload 
        };
      default:
        return state;
    }
  };
  
  export default foodReducer;