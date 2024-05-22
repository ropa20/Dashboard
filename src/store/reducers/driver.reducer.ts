import { GET_MANY_DRIVER, GET_DRIVER } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  driver: {},
  drivers: []
};

const DriverReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case GET_DRIVER:
      return { ...state, driver: action.payload }
    case GET_MANY_DRIVER:
      return { ...state, drivers: action.payload }
    default:
      return state;
  }
}

export default DriverReducer
