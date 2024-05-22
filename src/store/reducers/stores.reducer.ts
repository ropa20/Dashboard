import { GET_MANY_STORES, GET_STORES } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  stores: {},
  storess: []
};

const StoresReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case GET_STORES:
      return { ...state, stores: action.payload }
    case GET_MANY_STORES:
      return { ...state, storess: action.payload }
    default:
      return state;
  }
}

export default StoresReducer
