import { GET_MANY_USER, GET_USER } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  user: {},
  users: []
};

const UserReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case GET_USER:
      return { ...state, user: action.payload }
    case GET_MANY_USER:
      return { ...state, users: action.payload }
    default:
      return state;
  }
}

export default UserReducer
