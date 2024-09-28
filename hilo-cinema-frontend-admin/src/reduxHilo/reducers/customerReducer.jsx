const initialState = {
  loading: false,
  customers: [],
  count: 0,
  error: null,
  emailExists: false,
  searchResults: [],
};
const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CUSTOMERS_REQUEST":
    case "CHECK_EMAIL_EXISTS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "CHECK_EMAIL_EXISTS_SUCCESS":
      return {
        ...state,
        loading: false,
        emailExists: action.payload,
      };
    case "FETCH_CUSTOMERS_SUCCESS":
      
      return {
        ...state,
        loading: false,
        customers: action.payload,
      };
    case "ADD_CUSTOMER_SUCCESS":
      if (!action.payload || !action.payload.id) {
        console.error("Invalid payload for ADD_CUSTOMER_SUCCESS:", action.payload);
        return state;
      }
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };
    case "ADD_CUSTOMER_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "SEARCH_CUSTOMERS_SUCCESS":
      return {
        ...state,
        loading: false,
        searchResults: action.payload,
      };
      
    case "CLEAR_SEARCH_RESULTS":
      return {
        ...state,
        searchResults: [],
      };
    case "FETCH_CUSTOMERS_FAILURE":
    case "SEARCH_CUSTOMERS_FAILURE":
    case "CHECK_EMAIL_EXISTS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "EDIT_CUSTOMER_SUCCESS":
      if (!action.payload || !action.payload.id) {
        console.error("Invalid payload for EDIT_CUSTOMER_SUCCESS:", action.payload);
        return {
          ...state,
          error: "Invalid payload for customer update",
        };
      }
      return {
        ...state,
        customers: state.customers.map(cus =>
          cus.id === action.payload.id ? action.payload : cus
        ),
      };
    case "EDIT_CUSTOMER_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_CUSTOMERS_COUNT_SUCCESS":
      return {
        ...state,
        count: action.payload,
      };
    case "FETCH_CUSTOMERS_COUNT_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "HIDE_CUSTOMER_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "HIDE_CUSTOMER_SUCCESS":
      if (!action.payload || !action.payload.id) {
        console.error("Invalid payload for HIDE_CUSTOMER_SUCCESS:", action.payload);
        return state;
      }
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        ),
      };
    case "HIDE_CUSTOMER_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default customerReducer;
