import { GET_MANY_BOOKING, GET_BOOKING } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  booking: {},
  bookings: []
};

const BookingReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case GET_BOOKING:
      return { ...state, booking: action.payload }
    case GET_MANY_BOOKING:
      return { ...state, bookings: action.payload }
    default:
      return state;
  }
}

export default BookingReducer
