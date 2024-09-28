// src/redux/actions/trailerActions.js

export const OPEN_TRAILER_MODAL = 'OPEN_TRAILER_MODAL';
export const CLOSE_TRAILER_MODAL = 'CLOSE_TRAILER_MODAL';

export const openTrailerModal = (url) => ({
  type: OPEN_TRAILER_MODAL,
  payload: url,
});

export const closeTrailerModal = () => ({
  type: CLOSE_TRAILER_MODAL,
});
