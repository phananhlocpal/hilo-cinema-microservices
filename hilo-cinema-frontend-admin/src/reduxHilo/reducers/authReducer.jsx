import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, FETCH_EMPLOYEES_COUNT_SUCCESS, FETCH_EMPLOYEES_COUNT_FAILURE } from '../types/type';

const initialState = {
  loading: false,
  user: JSON.parse(localStorage.getItem('user')) || null, // Lưu toàn bộ thông tin employee vào user
  token: localStorage.getItem('token') || null,
  count: 0,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      console.log("User data:", action.payload.user);
      return {
        ...state,
        loading: false,
        user: action.payload.user, // Lưu toàn bộ đối tượng employee vào user
        token: action.payload.token,
      };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT:
      return { ...state, user: null, token: null, error: null };
    case FETCH_EMPLOYEES_COUNT_SUCCESS:
      return {
        ...state,
        count: action.payload,  // Cập nhật count khi fetch thành công
      };
    case FETCH_EMPLOYEES_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
