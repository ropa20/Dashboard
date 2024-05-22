import store from "store/store"
import {
  TEST_ACTION,
  GET_ORGANIZATION,
  GET_MANY_ORGANIZATION,
  GET_USER,
  GET_MANY_USER,
  GET_VEHICLE,
  GET_MANY_VEHICLE,
  GET_STORES, 
  GET_MANY_STORES,
  GET_HUB,
  GET_MANY_HUB,
  GET_OUTSOURCE,
  GET_MANY_OUTSOURCE,
  GET_PAYOUT,
  GET_MANY_PAYOUT,
  GET_DRIVER,
  GET_MANY_DRIVER,
  GET_BOOKING,
  GET_MANY_BOOKING,
  SET_ADDRESS_QUERY,
  SET_STORE_QUERY,
  SET_ORGANIZATION_QUERY,
  SET_USER_QUERY,
  SET_DRIVER_QUERY,
  SET_VEHICLE_QUERY,
  GET_CHECKIN, 
  GET_MANY_CHECKIN,
  // _RTI_
  

} from "./types.utils";

export const testDispatch = (payload: object) => (
  store.dispatch({
    type: TEST_ACTION,
    payload: payload
  }));

export const setOrganization = (payload: object) => {
  store.dispatch({
    type: GET_ORGANIZATION,
    payload: payload
  })
}

export const setManyOrganization = (payload: object) => {
  store.dispatch({
    type: GET_MANY_ORGANIZATION,
    payload: payload
  })
}

export const setUser = (payload: object) => {
  store.dispatch({
    type: GET_USER,
    payload: payload
  })
}

export const setManyUser = (payload: any[]) => {
  store.dispatch({
    type: GET_MANY_USER,
    payload: payload
  })
}

export const setVehicle = (payload: object) => {
  store.dispatch({
    type: GET_VEHICLE,
    payload: payload
  })
}

export const setManyVehicle = (payload: any[]) => {
  store.dispatch({
    type: GET_MANY_VEHICLE,
    payload: payload
  })
}

export const setHub = (payload: object) => {
  store.dispatch({
    type: GET_HUB,
    payload: payload
  })
}

export const setManyHub = (payload: any[]) => {
  store.dispatch({
    type: GET_MANY_HUB,
    payload: payload
  })
}

export const setOutsource = (payload: object) => {
  store.dispatch({
    type: GET_OUTSOURCE,
    payload: payload
  })
}

export const setManyOutsource = (payload: any[]) => {
  store.dispatch({
    type: GET_MANY_OUTSOURCE,
    payload: payload
  })
}

export const setPayout = (payload: object) => {
  store.dispatch({
    type: GET_PAYOUT,
    payload: payload
  })
}

export const setManyPayout = (payload: any[]) => {
  store.dispatch({
    type: GET_MANY_PAYOUT,
    payload: payload
  })
}

export const setDriver = (payload: object) => {
  store.dispatch({
    type: GET_DRIVER,
    payload: payload
  })
}

export const setManyDriver = (payload: any[]) => {
  store.dispatch({
    type: GET_MANY_DRIVER,
    payload: payload
  })
}

export const setBooking = (payload: object) => {
  store.dispatch({
    type: GET_BOOKING,
    payload: payload
  })
}

export const setManyBooking = (payload: any[]) => {
  store.dispatch({
    type: GET_MANY_BOOKING,
    payload: payload
  })
}

export const setAddressQuery = (payload: object) => {
  store.dispatch({
    type: SET_ADDRESS_QUERY,
    payload: payload
  })
}
export const setStoreQuery = (payload: object) => {
  store.dispatch({
    type: SET_STORE_QUERY,
    payload: payload
  })
}
export const setOrganizationQuery = (payload: object) => {
  store.dispatch({
    type: SET_ORGANIZATION_QUERY,
    payload: payload
  })
}
export const setUserQuery = (payload: object) => {
  store.dispatch({
    type: SET_USER_QUERY,
    payload: payload
  })
}
export const setDriverQuery = (payload: object) => {
  store.dispatch({
    type: SET_DRIVER_QUERY,
    payload: payload
  })
}
export const setVehicleQuery = (payload: object) => {
  store.dispatch({
    type: SET_VEHICLE_QUERY,
    payload: payload
  })
}

  export const setCheckin = (payload: object) => {
    store.dispatch({
      type: GET_CHECKIN,
      payload: payload
    })
  }
  
  export const setManyCheckin = (payload: any[]) => {
    store.dispatch({
      type: GET_MANY_CHECKIN,
      payload: payload
    })
  }
  
  export const setStores = (payload: object) => {
    store.dispatch({
      type: GET_STORES,
      payload: payload
    })
  }
  
  export const setManyStores = (payload: any[]) => {
    store.dispatch({
      type: GET_MANY_STORES,
      payload: payload
    })
  }
  
  // _RA_