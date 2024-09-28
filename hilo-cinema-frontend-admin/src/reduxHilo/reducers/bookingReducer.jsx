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

const initialState = {
  theaterId: null,
  movieId: null,
  scheduleId: null,
  roomId: null,
  selectedSeats: [],
  customerId: null,
  foodList: [],
  totalAmount: 0,
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_THEATER:
      return { ...state, theaterId: action.payload };

    case SELECT_MOVIE:
      return { ...state, movieId: action.payload };

    case SELECT_SCHEDULE:
      return { ...state, scheduleId: action.payload };

    case SELECT_ROOM:
      return { ...state, roomId: action.payload };

    case SELECT_SEAT: {
      const seat = action.payload;
      const seatPrice = seat.type === 'VIP' ? 100000 : seat.type === 'Couple' ? 150000 : 75000;
      return {
        ...state,
        selectedSeats: [...state.selectedSeats, seat],
        totalAmount: state.totalAmount + seatPrice,
      };
    }

    case DESELECT_SEAT: {
      const seatId = action.payload;
      const deselectedSeat = state.selectedSeats.find(seat => seat.id === seatId);
      const seatPrice = deselectedSeat.type === 'VIP' ? 100000 : deselectedSeat.type === 'Couple' ? 150000 : 75000;
      return {
        ...state,
        selectedSeats: state.selectedSeats.filter(seat => seat.id !== seatId),
        totalAmount: state.totalAmount - seatPrice,
      };
    }

    case SELECT_CUSTOMER:
      return { ...state, customerId: action.payload };

    case SELECT_FOOD: {
      const { foodId, quantity } = action.payload;

      const existingFoodIndex = state.foodList.findIndex(
        (foodItem) => foodItem.foodId === foodId
      );

      if (existingFoodIndex !== -1) {
        // Nếu food đã tồn tại, cập nhật số lượng
        const updatedFoodList = [...state.foodList];
        updatedFoodList[existingFoodIndex] = {
          ...updatedFoodList[existingFoodIndex],
          quantity, // Cập nhật quantity mới
        };

        return {
          ...state,
          foodList: updatedFoodList,
        };
      } else {
        // Nếu food chưa tồn tại, thêm mới vào foodList
        return {
          ...state,
          foodList: [
            ...state.foodList,
            { foodId, quantity }, // Thêm food mới với quantity
          ],
        };
      }
    }

    case CLEAR_BOOKING:
      return initialState;

    default:
      return state;
  }
};

export default bookingReducer;
