import { GET_MANY_OUTSOURCE, GET_OUTSOURCE } from "utils/types.utils";
import { storeAction } from "interfaces/common.interface";

const initialState = {
  outsource: {},
  outsources: [],
};

const OutsourceReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case GET_OUTSOURCE:
      return { ...state, outsource: action.payload };
    case GET_MANY_OUTSOURCE:
      return { ...state, outsources: action.payload };
    default:
      return state;
  }
};

export default OutsourceReducer;
