import {
  FETCH_ACTORS_REQUEST, FETCH_ACTORS_SUCCESS,
  FETCH_ACTORS_FAILURE,
  EDIT_ACTORS_SUCCESS, EDIT_ACTORS_FAILURE,
  ADD_ACTORS_SUCCESS, ADD_ACTORS_FAILURE,
  HIDDEN_ACTORS_SUCCESS, HIDDEN_ACTORS_FAILURE,
  FETCH_ACTORS_COUNT_SUCCESS, FETCH_ACTORS_COUNT_FAILURE
} from "../types/type";

const initialState = {
  loading: false,
  actors: [],
  count: 0,
  error: null
};

const actorReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACTORS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null, // reset error state when fetching starts
      };
    case FETCH_ACTORS_SUCCESS:
      return {
        ...state,
        loading: false,
        actors: action.payload,
      };
    case FETCH_ACTORS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case EDIT_ACTORS_SUCCESS:
      return {
        ...state,
        loading: false,
        actors: state.actors.map((actor) =>
          actor.id === action.payload.id ? action.payload : actor
        ),
      };
    case EDIT_ACTORS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_ACTORS_SUCCESS:
      return {
        ...state,
        actors: [...state.actors, action.payload],
      };
    case ADD_ACTORS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case HIDDEN_ACTORS_SUCCESS:
      return {
        ...state,
        actors: state.actors.filter(actor => actor.id !== action.payload.id),
      };

    case HIDDEN_ACTORS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default actorReducer;
