import { GET_MANY__MNC_, GET__MNC_ } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  _MNS_: {},
  _MNS_s: []
};

const _MN_Reducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case GET__MNC_:
      return { ...state, _MNS_: action.payload }
    case GET_MANY__MNC_:
      return { ...state, _MNS_s: action.payload }
    default:
      return state;
  }
}

export default _MN_Reducer
