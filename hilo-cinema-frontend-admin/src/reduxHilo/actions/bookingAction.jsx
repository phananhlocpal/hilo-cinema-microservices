// Action Types
import {
  SELECT_THEATER,
  SELECT_MOVIE,
  SELECT_SCHEDULE,
  SELECT_ROOM,
  SELECT_SEAT,
  DESELECT_SEAT,
  SELECT_CUSTOMER,
  SELECT_FOOD,
  CLEAR_BOOKING,
} from '../types/type';

// Theater Action
export const selectTheater = (theaterId) => ({
  type: SELECT_THEATER,
  payload: theaterId,
});

// Movie Action
export const selectMovie = (movieId) => ({
  type: SELECT_MOVIE,
  payload: movieId,
});

// Schedule Action
export const selectSchedule = (scheduleId) => ({
  type: SELECT_SCHEDULE,
  payload: scheduleId,
});

// Room Action
export const selectRoom = (roomId) => ({
  type: SELECT_ROOM,
  payload: roomId,
});

// Seat Actions
export const selectSeat = (seat) => ({
  type: SELECT_SEAT,
  payload: seat,
});

export const deselectSeat = (seatId) => ({
  type: DESELECT_SEAT,
  payload: seatId,
});

// Customer Action
export const selectCustomer = (customerId) => ({
  type: SELECT_CUSTOMER,
  payload: customerId,
});

// Food Action
export const selectFood = (foodId, quantity) => ({
  type: SELECT_FOOD,
  payload: { foodId, quantity },
});

// Clear Booking Action
export const clearBooking = () => ({
  type: CLEAR_BOOKING,
});
