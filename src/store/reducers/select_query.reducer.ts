import { SET_ADDRESS_QUERY, SET_DRIVER_QUERY, SET_STORE_QUERY, SET_USER_QUERY, SET_ORGANIZATION_QUERY, SET_VEHICLE_QUERY } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  address: {},
  store: {},
  organization: {},
  driver: {},
  vehicle: {},
  user: {}
};

const SelectQuery = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case SET_ADDRESS_QUERY:
      return { ...state, address: action.payload }
    case SET_STORE_QUERY:
      return { ...state, store: action.payload }
    case SET_ORGANIZATION_QUERY:
      return { ...state, organization: action.payload }
    case SET_DRIVER_QUERY:
      return { ...state, driver: action.payload }
    case SET_VEHICLE_QUERY:
      return { ...state, vehicle: action.payload }
    case SET_USER_QUERY:
      return { ...state, user: action.payload }
    default:
      return state;
  }
}

export default SelectQuery
