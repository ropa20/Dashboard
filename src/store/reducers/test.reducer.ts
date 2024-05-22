import { TEST_ACTION } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  test: "test",
  foo: "bar"
};

const TestReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case TEST_ACTION:
      let newState = { ...state }
      newState = { ...newState, ...action.payload }
      return newState
    default:
      return state;
  }
}

export default TestReducer
