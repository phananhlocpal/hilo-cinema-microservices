import axios from "axios";
import { 
  FETCH_EMPLOYEES_REQUEST, FETCH_EMPLOYEES_SUCCESS, 
  FETCH_EMPLOYEES_FAILURE, EDIT_EMPLOYEE_SUCCESS, 
  EDIT_EMPLOYEE_FAILURE, ADD_EMPLOYEE_SUCCESS, 
  ADD_EMPLOYEE_FAILURE,
  UPDATE_EMPLOYEE_STATUS_SUCCESS, 
  UPDATE_EMPLOYEE_STATUS_FAILURE,
  FETCH_MOVIES_COUNT_SUCCESS, FETCH_MOVIES_COUNT_FAILURE,
  CHECK_EMAIL_EXISTS_REQUEST,CHECK_EMAIL_EXISTS_SUCCESS,
  CHECK_EMAIL_EXISTS_FAILURE

} from "../types/type";


// Fetch employees actions
export const fetchEmployeesRequest = () => ({
  type: FETCH_EMPLOYEES_REQUEST,
});

export const fetchEmployeesSuccess = (employees) => ({
  type: FETCH_EMPLOYEES_SUCCESS,
  payload: employees,
});

export const fetchEmployeesFailure = (error) => ({
  type: FETCH_EMPLOYEES_FAILURE,
  payload: error.message || error.toString(),
});

export const fetchEmployees = () => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;
    dispatch(fetchEmployeesRequest());

    return axios.get("http://localhost:8000/EmployeeService", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',  // Gửi Site-Type trong header
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(fetchEmployeesSuccess(response.data));
      })
      .catch(error => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(fetchEmployeesFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(fetchEmployeesFailure("Forbidden access"));
        } else {
          dispatch(fetchEmployeesFailure(error));
        }
      });
  };
};

// Edit employee actions
export const editEmployeeSuccess = (employee) => ({
  type: EDIT_EMPLOYEE_SUCCESS,
  payload: employee,
});

export const editEmployeeFailure = (error) => ({
  type: EDIT_EMPLOYEE_FAILURE,
  payload: error.message || error.toString(),
});

export const editEmployee = (id, employeeData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;
    dispatch(fetchEmployeesRequest());

    return axios.put(`http://localhost:8000/EmployeeService/${id}`, employeeData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',  // Gửi Site-Type trong header
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(editEmployeeSuccess(response.data));
      })
      .catch(error => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(editEmployeeFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(editEmployeeFailure("Forbidden access"));
        } else {
          dispatch(editEmployeeFailure(error));
        }
      });
  };
};
//Add Employee
export const addEmployeeSuccess = (employee) => ({
  type: ADD_EMPLOYEE_SUCCESS,
  payload: employee,
});

export const addEmployeeFailure = (error) => ({
  type: ADD_EMPLOYEE_FAILURE,
  payload: error.message || error.toString(),
});

export const addEmployee = (employeeData) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;
    console.log(token)
    dispatch(fetchEmployeesRequest());

    return axios.post("http://localhost:8000/EmployeeService", employeeData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',  // Gửi Site-Type trong header
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        dispatch(addEmployeeSuccess(response.data));
      })
      .catch(error => {
        console.error("There was an error!", error.message);
        if (error.response && error.response.status === 401) {
          dispatch(addEmployeeFailure("Unauthorized access"));
        } else if (error.response && error.response.status === 403) {
          dispatch(addEmployeeFailure("Forbidden access"));
        } else {
          dispatch(addEmployeeFailure(error));
        }
      });
  };
};

//hidden
export const updateEmployeeStatusSuccess = (employee) => ({
  type: UPDATE_EMPLOYEE_STATUS_SUCCESS,
  payload: employee,
});

export const updateEmployeeStatusFailure = (error) => ({
  type: UPDATE_EMPLOYEE_STATUS_FAILURE,
  payload: error.message || error.toString(),
});

export const updateEmployeeStatus = (id) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;

    dispatch(fetchEmployeesRequest());

    return axios.put(`http://localhost:8000/EmployeeService/${id}/disable`, {},{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',  // Gửi Site-Type trong header
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      dispatch(updateEmployeeStatusSuccess(response.data.employee));
    })
    .catch(error => {
      dispatch(updateEmployeeStatusFailure(error));
    });
  };
};
//Count
export const fetchEmployeesCountSuccess = (count) => ({
  type: FETCH_MOVIES_COUNT_SUCCESS,
  payload: count,
});

export const fetchEmployeesCountFailure = (error) => ({
  type: FETCH_MOVIES_COUNT_FAILURE,
  payload: error.message || error.toString(),
});

export const fetchEmployeesCount = () => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const token = state.auth.token;  // Giả sử token được lưu trữ trong state.auth.token

      const response = await axios.get('http://localhost:8000/EmployeeService/count', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Thêm token vào header của yêu cầu
        },
      });
      dispatch(fetchEmployeesCountSuccess(response.data));
    } catch (error) {
      dispatch(fetchEmployeesCountFailure(error));
    }
  };
};
//
export const fetchEmployeeById = (id) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;
    dispatch(fetchEmployeesRequest());

    return axios.get(`http://localhost:8000/EmployeeService/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',  // Gửi Site-Type trong header
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      dispatch(fetchEmployeesSuccess(response.data.employee));
    })
    .catch(error => {
      dispatch(fetchEmployeesFailure(error));
    });
  };
};
//Check Mail
export const checkEmailExistsRequest = () => ({
  type: CHECK_EMAIL_EXISTS_REQUEST,
});

export const checkEmailExistsSuccess = (exists) => ({
  type: CHECK_EMAIL_EXISTS_SUCCESS,
  payload: exists,
});

export const checkEmailExistsFailure = (error) => ({
  type: CHECK_EMAIL_EXISTS_FAILURE,
  payload: error.message || error.toString(),
});

export const checkEmailExists = (email) => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const sysRole = state.auth.user ? state.auth.user.sysRole : null;
    console.log(token)
    dispatch(checkEmailExistsRequest());

    return axios.post(`http://localhost:8000/EmployeeService/CheckEmail`, email, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Site-Type': sysRole || 'default',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const emailExists = response.data.exists;
        dispatch(checkEmailExistsSuccess(emailExists));
        return emailExists;  // Trả về kết quả để có thể sử dụng trong component
      })
      .catch(error => {
        console.error("There was an error!", error.message);
        dispatch(checkEmailExistsFailure(error));
        throw error;  // Ném ra lỗi để có thể xử lý trong component
      });
  };
};