import { combineReducers } from "redux";
import movieReducer from "./movieReducer";
import AuthenReducer from "./authenReducer";

export const allReducers = combineReducers({
    movie: movieReducer,
    authen: AuthenReducer,
});
