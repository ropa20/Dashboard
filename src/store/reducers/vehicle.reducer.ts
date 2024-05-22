import { GET_MANY_VEHICLE, GET_VEHICLE } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  vehicle: {},
  vehicles: []
};

const VehicleReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case GET_VEHICLE:
      return { ...state, vehicle: action.payload }
    case GET_MANY_VEHICLE:
      return { ...state, vehicles: action.payload }
    default:
      return state;
  }
}

export default VehicleReducer
