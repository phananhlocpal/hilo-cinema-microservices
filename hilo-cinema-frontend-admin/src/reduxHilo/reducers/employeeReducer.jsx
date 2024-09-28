import {
  FETCH_EMPLOYEES_REQUEST, FETCH_EMPLOYEES_SUCCESS, FETCH_EMPLOYEES_FAILURE,
  EDIT_EMPLOYEE_SUCCESS, EDIT_EMPLOYEE_FAILURE, ADD_EMPLOYEE_SUCCESS,
  ADD_EMPLOYEE_FAILURE,
  UPDATE_EMPLOYEE_STATUS_SUCCESS,
  UPDATE_EMPLOYEE_STATUS_FAILURE,
  CHECK_EMAIL_EXISTS_REQUEST, CHECK_EMAIL_EXISTS_SUCCESS, CHECK_EMAIL_EXISTS_FAILURE
} from '../types/type';

const initialState = {
  loading: false,
  employees: [],
  error: null,
  emailExists: false,  // New state property for email validation
};

const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EMPLOYEES_REQUEST:
    case CHECK_EMAIL_EXISTS_REQUEST:  // Handle loading state for email check
      return {
        ...state,
        loading: true,
        error: null, // Reset error when starting a new request
      };
    case FETCH_EMPLOYEES_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: action.payload,
      };
    case CHECK_EMAIL_EXISTS_SUCCESS:  // Handle success for email check
      return {
        ...state,
        loading: false,
        emailExists: action.payload,  // Store result of email check
      };
    case FETCH_EMPLOYEES_FAILURE:
    case CHECK_EMAIL_EXISTS_FAILURE:  // Handle failure for email check
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case EDIT_EMPLOYEE_SUCCESS:
      if (!action.payload || !action.payload.id) {
        console.error("Invalid payload for EDIT_EMPLOYEE_SUCCESS:", action.payload);
        return state;
      }
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload.id ? action.payload : emp
        ),
      };
    case EDIT_EMPLOYEE_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_EMPLOYEE_SUCCESS:
      if (!action.payload || !action.payload.id) {
        console.error("Invalid payload for ADD_EMPLOYEE_SUCCESS:", action.payload);
        return state;
      }
      return {
        ...state,
        employees: [...state.employees, action.payload],
      };
    case ADD_EMPLOYEE_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_EMPLOYEE_STATUS_SUCCESS:
      if (!action.payload || !action.payload.id) {
        console.error("Invalid payload for UPDATE_EMPLOYEE_STATUS_SUCCESS:", action.payload);
        return state;
      }
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload.id ? action.payload : emp
        ),
      };
    case UPDATE_EMPLOYEE_STATUS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default employeeReducer;
