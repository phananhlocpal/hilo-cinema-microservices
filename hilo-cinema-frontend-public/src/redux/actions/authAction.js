// Action types
export const SET_AUTH_DATA = 'SET_AUTH_DATA';
export const IS_LOG_IN = 'IS_LOG_IN'; 
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

// Action creators
export const setAuthData = (account, jwtToken) => ({
    type: SET_AUTH_DATA,
    payload: { account, jwtToken },
});

export const isLogIn = (isLoggedIn) => ({  
    type: IS_LOG_IN,
    payload: isLoggedIn,
});

export const updateAccount = (updatedAccount) => ({  
    type: UPDATE_ACCOUNT,
    payload: updatedAccount,
});