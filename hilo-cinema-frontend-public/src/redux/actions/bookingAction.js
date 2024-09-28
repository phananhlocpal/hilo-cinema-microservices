import axios from 'axios';

export const SET_VOUCHER = 'SET_VOUCHER';
export const SET_PAYMENT_METHOD = 'SET_PAYMENT_METHOD';
export const SET_STARS = 'SET_STARS';
export const GOTO_CHOOSE_FOOD_TAB = 'GOTO_CHOOSE_FOOD_TAB';
export const GOTO_PAYMENT_TAB = 'GOTO_PAYMENT_TAB';
export const SELECT_SEAT = 'SELECT_SEAT';
export const DESELECT_SEAT = 'DESELECT_SEAT';
export const SELECT_FOOD = 'SELECT_FOOD';
export const SET_CINEMA_DATA = 'SET_CINEMA_DATA';
export const SET_FOOD_LIST = 'SET_FOOD_LIST';
export const SET_MOVIE_BOOKING = 'SET_MOVIE_BOOKING';

export const setMovieBooking = (data) => ({
  type: SET_MOVIE_BOOKING,
  payload: data,
});

export const goto_chooseFoodTab = (data) => ({
  type: GOTO_CHOOSE_FOOD_TAB,
  payload: data,
});

export const goto_paymentTab = (data) => ({
  type: GOTO_PAYMENT_TAB,
  payload: data,
});

export const selectSeat = (seat) => ({
  type: SELECT_SEAT,
  payload: seat,
});

export const deselectSeat = (seat) => ({
  type: DESELECT_SEAT,
  payload: seat,
});

export const setFoodList = (foodList) => ({
  type: SET_FOOD_LIST,
  payload: foodList,
});

export const selectFood = (foodId, quantity) => ({
  type: SELECT_FOOD,
  payload: { foodId, quantity },
});

export const setVoucherAction = (voucher) => ({
  type: SET_VOUCHER,
  payload: voucher,
});

export const setPaymentMethodAction = (paymentMethod) => ({
  type: SET_PAYMENT_METHOD,
  payload: paymentMethod,
});

export const setStarsAction = (stars) => ({
  type: SET_STARS,
  payload: stars,
});

export const setCinemaData = (cinemaData) => ({
  type: SET_CINEMA_DATA,
  payload: cinemaData,
});

const transformSeatData = (apiResponse) => {
  try {
    const { schedules } = apiResponse;
    
    if (!schedules || schedules.length === 0) {
      throw new Error('No schedules found in the response');
    }

    const seats = schedules.map(schedule => {
      const { seat } = schedule;
      
      if (!seat || !seat.rowSeat || !seat.colSeat || !seat.status || !seat.type) {
        throw new Error('Incomplete seat information found');
      }

      return {
        row: String.fromCharCode(65 + seat.rowSeat - 1), // Convert row number to letter
        col: seat.colSeat,
        status: seat.status === 'Active' ? 'available' : 'disavailable',
        type: seat.type,
        name: `${String.fromCharCode(65 + seat.rowSeat - 1)}${seat.colSeat}`
      };
    });

    const roomDetails = schedules[0].seat.room;
    const cinemaDetails = roomDetails.theater;

    if (!roomDetails || !cinemaDetails) {
      throw new Error('Room or Cinema details are missing in the response');
    }

    return {
      id: roomDetails.id,
      cinemaName: cinemaDetails.name,
      room: roomDetails.id,
      row: roomDetails.rowNum,
      col: roomDetails.colNum,
      seats
    };
  } catch (error) {
    console.error('Error in transformSeatData:', error);
    throw error; // Re-throw the error after logging
  }
};

export const fetchAndSetCinemaData = (movieUrl) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:8000/ScheduleService/movieUrl/${movieUrl}`);
    
    if (!response.data) {
      throw new Error('No data received from the API');
    }
    
    const transformedData = transformSeatData(response.data);
    dispatch(setCinemaData(transformedData));
  } catch (error) {
    console.error('Error fetching or transforming data:', error);
    // Optionally handle the error with a failure action
  }
};
