import { combineReducers } from "redux";
import bookingReducer from "./bookingReducer";
import detailPostReducer from "./detailPostReducer";
import homeReducer from "./homeReducer";
import movieDetailReducer from "./movieDetail/movieDetailReducer";
import postListReducer from "./postListReducer";
import theaterReducer from "./theaterReducer";
import scheduleReducer from "./movieDetail/scheduleReducer";
import trailerReducer from "./trailerReducer";
import movieReducer from "./movieReducer";
import authReducer from "./authReducer";


export const allReducers = combineReducers({
  booking: bookingReducer,
  detailPost: detailPostReducer,
  home: homeReducer,
  movieDetail: movieDetailReducer,
  schedule: scheduleReducer,
  postList: postListReducer,
  theater: theaterReducer,
  trailer: trailerReducer,
  movies: movieReducer,
  auth: authReducer,
});
