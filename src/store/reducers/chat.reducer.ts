import { CONVERSATION } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  selectedConv: ""
};

const ChatReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case CONVERSATION:
      let newState = { ...state }
      newState = { ...newState, ...action.payload }
      return newState
    default:
      return state;
  }
}

export default ChatReducer
