import { SAVE_ACCOUNT_SESSION } from "../actionTypes";

const initialState = {
    account: null,
};

const AuthenReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_ACCOUNT_SESSION:
            return {
                ...state,
                account: action.payload,
            };
        default:
            return state;
    }
};

export default AuthenReducer;
