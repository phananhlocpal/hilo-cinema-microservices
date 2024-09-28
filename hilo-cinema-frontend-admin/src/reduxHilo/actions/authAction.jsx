import axios from 'axios';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT,
  FETCH_EMPLOYEES_REQUEST, FETCH_EMPLOYEES_SUCCESS, 
  FETCH_EMPLOYEES_FAILURE, EDIT_EMPLOYEE_SUCCESS, 
  EDIT_EMPLOYEE_FAILURE, ADD_EMPLOYEE_SUCCESS, 
  ADD_EMPLOYEE_FAILURE,
  UPDATE_EMPLOYEE_STATUS_SUCCESS, 
  UPDATE_EMPLOYEE_STATUS_FAILURE,
  FETCH_EMPLOYEES_COUNT_SUCCESS, FETCH_EMPLOYEES_COUNT_FAILURE 

} from '../types/type';

export const login = (credentials) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const response = await fetch('http://localhost:8000/EmployeeAuthen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message || 'Login failed');
      }

      const data = await response.json();

      // Lưu JWT và thông tin Employee vào localStorage
      localStorage.setItem('token', data.jwtToken);
      localStorage.setItem('user', JSON.stringify(data.employee)); // Lưu toàn bộ đối tượng employee

      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token: data.jwtToken,
          user: data.employee, // Gán toàn bộ employee vào user
        },
      });
    } catch (error) {
      console.error("There was an error!", error);
      dispatch({ type: LOGIN_FAILURE, payload: error.message });
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    // Xóa JWT và thông tin người dùng từ localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch hành động LOGOUT để cập nhật state trong reducer
    dispatch({ type: LOGOUT });
  };
};



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
  return (dispatch) => {
    dispatch(fetchEmployeesRequest());
    return axios.get("http://localhost:8000/EmployeeAuthen")
      .then(response => {
        dispatch(fetchEmployeesSuccess(response.data));
      })
      .catch(error => {
        dispatch(fetchEmployeesFailure(error));
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
  return (dispatch) => {
    return axios.put(`http://localhost:8000/EmployeeAuthen/${id}`, employeeData)
      .then(response => {
        dispatch(editEmployeeSuccess(response.data));
      })
      .catch(error => {
        dispatch(editEmployeeFailure(error));
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
  return (dispatch) => {
    return axios.post("http://localhost:8000/EmployeeAuthen", employeeData)
      .then(response => {
        dispatch(addEmployeeSuccess(response.data));
      })
      .catch(error => {
        dispatch(addEmployeeFailure(error));
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
  return (dispatch) => {
    return axios.put(
      `http://localhost:8000/EmployeeAuthen/hidden/${id}`,
      {}, // Không cần truyền dữ liệu trong body
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
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
  type: FETCH_EMPLOYEES_COUNT_SUCCESS,
  payload: count,
});

export const fetchEmployeesCountFailure = (error) => ({
  type: FETCH_EMPLOYEES_COUNT_FAILURE,
  payload: error.message || error.toString(),
});

export const fetchEmployeesCount = () => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const token = state.auth.token;  // Giả sử token được lưu trữ trong state.auth.token

      const response = await axios.get('http://localhost:8000/EmployeeService/Count', {
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