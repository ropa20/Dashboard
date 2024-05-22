import { GET_MANY_PAYOUT, GET_PAYOUT } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  payout: {},
  payouts: []
};

const PayoutReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case GET_PAYOUT:
      return { ...state, payout: action.payload }
    case GET_MANY_PAYOUT:
      return { ...state, payouts: action.payload }
    default:
      return state;
  }
}

export default PayoutReducer
