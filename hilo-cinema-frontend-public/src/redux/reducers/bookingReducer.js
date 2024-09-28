import { 
  SET_VOUCHER, 
  SET_PAYMENT_METHOD, 
  SET_STARS, 
  SELECT_SEAT, 
  DESELECT_SEAT, 
  SELECT_FOOD, 
  SET_CINEMA_DATA, 
  SET_FOOD_LIST,
  SET_MOVIE_BOOKING,
} from '../actions/bookingAction';

const initialState = {
  cinemaData: null, // This will be updated after fetching data
  movieBooking: null,
  selectedSeats: [],
  totalAmount: 0,
  foodList: [],
  voucher: '',
  paymentMethod: '',
  stars: 0,
  paymentMethods: [
    { value: 'vnpay', label: 'VNPAY', image: 'https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg', checked: true },
  ],
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MOVIE_BOOKING:
      console.log('Dispatching SET_MOVIE_BOOKING with payload:', action.payload);
      return {
        ...state,
        movieBooking: action.payload,
      };
    case SET_CINEMA_DATA:
      return {
        ...state,
        cinemaData: action.payload,
      };
      case SELECT_SEAT: {
        const seat = action.payload;
        const seatPrice = seat.seatType === 'VIP' ? 100000 : seat.seatType === 'Couple' ? 150000 : 75000;
        return {
          ...state,
          selectedSeats: [
            ...state.selectedSeats,
            {
              movieId: state.movieBooking.movieId,
              date: state.movieBooking.date,
              time: state.movieBooking.time,
              seatId: seat.seatId, 
              seatName: seat.seatName,
            }
          ],
          totalAmount: state.totalAmount + seatPrice,
        };
      }
      case DESELECT_SEAT: {
        const seat = action.payload;
        const seatPrice = seat.seatType === 'VIP' ? 100000 : seat.seatType === 'Double' ? 150000 : 75000;
        return {
          ...state,
          selectedSeats: state.selectedSeats.filter(
            selectedSeat => selectedSeat.seatId !== seat.seatId 
          ),
          totalAmount: state.totalAmount - seatPrice,
        };
      }
    case SET_FOOD_LIST:
      return {
        ...state,
        foodList: action.payload,
      };
      case SELECT_FOOD: {
        const updatedFoodList = state.foodList.map((foodItem) =>
          foodItem.id === action.payload.foodId
            ? { ...foodItem, quantity: action.payload.quantity }
            : foodItem
        );
        
        // Calculate new total amount based on updated food list
        const newTotalAmount = updatedFoodList.reduce((total, foodItem) => {
          return total + (foodItem.quantity * foodItem.price);
        }, state.selectedSeats.reduce((total, seat) => {
          const seatPrice = seat.seatType === 'VIP' ? 100000 : seat.seatType === 'Couple' ? 150000 : 75000;
          return total + seatPrice;
        }, 0));
        
        return {
          ...state,
          foodList: updatedFoodList,
          totalAmount: newTotalAmount,
        };
      }
    case SET_VOUCHER:
      return {
        ...state,
        voucher: action.payload,
      };
    case SET_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
        paymentMethods: state.paymentMethods.map((method) =>
          method.value === action.payload
            ? { ...method, checked: true }
            : { ...method, checked: false }
        ),
      };
    case SET_STARS:
      return {
        ...state,
        stars: action.payload,
      };
    default:
      return state;
  }
};

export default bookingReducer;
