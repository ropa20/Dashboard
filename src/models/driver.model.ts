
import { Functions } from '../utils/imports.utils';
import instance from "../utils/axios.utils"
import { setManyDriver, setDriver } from 'utils/redux.utils';

const Driver = {
  createDriver: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "driver/create_driver"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  editDriver: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "driver/edit_driver"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getDriver: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "driver/get_driver"
      instance().post(url, body).then(res => {
        setDriver(res?.data?.data)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getManyDriver: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "driver/get_many_driver"
      instance().post(url, body).then(res => {
        setManyDriver(res?.data?.data?.docs)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getStoreDrivers: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "driver/get_store_drivers"
      instance().post(url, body).then(res => {
        setManyDriver(res?.data?.data?.docs)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  deleteDriver: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "driver/delete_driver"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  earningSummary: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "driver/earning_summary"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getAllDriver: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "driver/get_all_driver"
      instance().post(url,body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
}

export default Driver
