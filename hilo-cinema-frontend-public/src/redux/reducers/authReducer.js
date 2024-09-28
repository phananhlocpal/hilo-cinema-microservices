import { SET_AUTH_DATA, IS_LOG_IN, UPDATE_ACCOUNT } from '../actions/authAction';

const initialState = {
    account: null,
    jwtToken: null,
    isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH_DATA:
            return {
                ...state,
                account: action.payload.account,
                jwtToken: action.payload.jwtToken,
                isAuthenticated: true,
            };
        case IS_LOG_IN:
            return {
                ...state,
                isAuthenticated: action.payload,
                account: action.payload ? state.account : null,
                jwtToken: action.payload ? state.jwtToken : null,
            };
        case UPDATE_ACCOUNT: 
            return {
                ...state,
                account: {
                    ...state.account,
                    ...action.payload,
                },
            };
        default:
            return state;
    }
};

export default authReducer;
