import axios from "axios";
import {
  FETCH_FOODS_REQUEST,
  FETCH_FOODS_SUCCESS,
  FETCH_FOODS_FAILURE,
  EDIT_FOOD_SUCCESS,
  EDIT_FOOD_FAILURE,
  ADD_FOOD_SUCCESS,
  ADD_FOOD_FAILURE,
  SEARCH_FOOD_BY_NAME_SUCCESS,
  SEARCH_FOOD_BY_NAME_FAILURE
} from "../types/type"; // Make sure you have these types defined

// Fetch all foods
export const fetchFoodsRequest = () => ({
  type: FETCH_FOODS_REQUEST
});

export const fetchFoodsSuccess = (foods) => ({
  type: FETCH_FOODS_SUCCESS,
  payload: foods
});

export const fetchFoodsFailure = (error) => ({
  type: FETCH_FOODS_FAILURE,
  payload: error.message || error.toString()
});

export const fetchFoods = () => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    dispatch(fetchFoodsRequest());

    return axios.get("http://localhost:8000/FoodService", { // Adjust the URL if needed
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(fetchFoodsSuccess(response.data));
      })
      .catch(error => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(fetchFoodsFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(fetchFoodsFailure("Forbidden access"));
        } else {
          dispatch(fetchFoodsFailure(error.message));
        }
      });
  };
};

// Fetch food by ID (You might not need this if you're fetching all foods)
export const fetchFoodById = (id) => {
  return (dispatch) => {
    return axios.get(`http://localhost:8000/FoodService/${id}`) 
      .then(response => {
        dispatch(fetchFoodsSuccess(response.data)); 
      })
      .catch(error => {
        console.error("There was an error fetching food details!", error);
        dispatch(fetchFoodsFailure(error));
      });
  };
};

// Edit Food
export const editFoodSuccess = (food) => ({
  type: EDIT_FOOD_SUCCESS,
  payload: food,
});

export const editFoodFailure = (error) => ({
  type: EDIT_FOOD_FAILURE,
  payload: error.message || error.toString(),
});

export const editFood = (id, foodData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    const formData = new FormData();
    for (const key in foodData) {
      formData.append(key, foodData[key]);
    }

    return axios.put(`http://localhost:8000/FoodService/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'multipart/form-data' 
      },
    })
      .then((response) => {
        dispatch(editFoodSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(editFoodFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(editFoodFailure("Forbidden access"));
        } else {
          dispatch(editFoodFailure(error));
        }
      });
  };
};

// Add Food
export const addFoodSuccess = (food) => ({
  type: ADD_FOOD_SUCCESS,
  payload: food,
});

export const addFoodFailure = (error) => ({
  type: ADD_FOOD_FAILURE,
  payload: error.message || error.toString(),
});

export const addFood = (foodData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    const formData = new FormData();
    for (const key in foodData) {
      formData.append(key, foodData[key]);
    }

    return axios.post("http://localhost:8000/FoodService", formData, { 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'multipart/form-data' 
      },
    })
      .then((response) => {
        dispatch(addFoodSuccess(response.data));
      })
      .catch((error) => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(addFoodFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(addFoodFailure("Forbidden access"));
        } else {
          dispatch(addFoodFailure(error));
        }
      });
  };
};

// Search Food by Name
export const searchFoodByNameSuccess = (foods) => ({
  type: SEARCH_FOOD_BY_NAME_SUCCESS,
  payload: foods
});

export const searchFoodByNameFailure = (error) => ({
  type: SEARCH_FOOD_BY_NAME_FAILURE,
  payload: error.message || error.toString()
});

export const searchFoodByName = (name) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    dispatch(fetchFoodsRequest()); 

    return axios.get(`http://localhost:8000/FoodService/search/${name}`, { 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(searchFoodByNameSuccess(response.data));
      })
      .catch(error => {
        console.error("There was an error searching foods by name!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(searchFoodByNameFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(searchFoodByNameFailure("Forbidden access"));
        } else {
          dispatch(searchFoodByNameFailure(error));
        }
      });
  };
};