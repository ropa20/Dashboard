import { GET_MANY_ORGANIZATION, GET_ORGANIZATION } from "utils/types.utils";
import { storeAction } from 'interfaces/common.interface'

const initialState = {
  organization: {},
  organizations: []
};

const OrganizationReducer = (state = initialState, action: storeAction) => {
  switch (action.type) {
    case GET_ORGANIZATION:
      return { ...state, organization: action.payload }
    case GET_MANY_ORGANIZATION:
      return { ...state, organizations: action.payload }
    default:
      return state;
  }
}

export default OrganizationReducer
