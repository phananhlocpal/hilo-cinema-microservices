const initialState = {
  loading: false,
  theaters: [],
  error: null
};

const theaterReducer = (state = initialState, action) => {
  switch (action.type) {
      case "FETCH_THEATERS_REQUEST":
          return {
              ...state,
              loading: true
          };
      case "FETCH_THEATERS_SUCCESS":
          return {
              ...state,
              loading: false,
              theaters: action.payload
          };
      case "FETCH_THEATERS_FAILURE":
          return {
              ...state,
              loading: false,
              error: action.payload
          };
      default:
          return state;
  }
};

export default theaterReducer;