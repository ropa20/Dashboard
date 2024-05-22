import { combineReducers } from "redux";
import testReducer from "store/reducers/test.reducer";
import chatReducer from "store/reducers/chat.reducer";
import userReducer from "store/reducers/user.reducer";
import organizationReducer from "./organization.reducer";
import vehicleReducer from "./vehicle.reducer";
import storesReducer from './stores.reducer';
import hubReducer from "./hub.reducer";
import outsourceReducer from "./outsource.reducer";
import payoutReducer from "./payout.reducer";
import driverReducer from "./driver.reducer";
import bookingReducer from "./booking.reducer";
import selectQuery from "./select_query.reducer";
import checkinReducer from './checkin.reducer'; 
// _RI_

export default combineReducers({
  test: testReducer,
  chat: chatReducer,
  user: userReducer,
  organization: organizationReducer,
  vehicle: vehicleReducer,
  hub: hubReducer,
  outsource: outsourceReducer,
  payout: payoutReducer,
  driver: driverReducer,
  booking: bookingReducer,
  selectQuery: selectQuery,
  checkin: checkinReducer,
  stores: storesReducer,
  // _RD_
});
