import { GET_MANY_HUB, GET_HUB } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  hub: {},
  hubs: []
};

const HubReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case GET_HUB:
      return { ...state, hub: action.payload }
    case GET_MANY_HUB:
      return { ...state, hubs: action.payload }
    default:
      return state;
  }
}

export default HubReducer
