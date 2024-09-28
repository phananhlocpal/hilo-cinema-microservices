import { OPEN_TRAILER_MODAL, CLOSE_TRAILER_MODAL } from '../actions/trailerAction';

const initialState = {
  isOpen: false,
  trailerUrl: '',
};

const trailerReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_TRAILER_MODAL:
      return {
        ...state,
        isOpen: true,
        trailerUrl: action.payload,
      };
    case CLOSE_TRAILER_MODAL:
      return {
        ...state,
        isOpen: false,
        trailerUrl: '',
      };
    default:
      return state;
  }
};

export default trailerReducer;