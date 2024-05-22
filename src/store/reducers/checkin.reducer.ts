import { GET_MANY_CHECKIN, GET_CHECKIN } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  checkin: {},
  checkins: []
};

const CheckinReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case GET_CHECKIN:
      return { ...state, checkin: action.payload }
    case GET_MANY_CHECKIN:
      return { ...state, checkins: action.payload }
    default:
      return state;
  }
}

export default CheckinReducer
