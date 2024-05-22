
import { Functions } from '../utils/imports.utils';
import instance from "../utils/axios.utils"
import { setManyVehicle, setVehicle } from 'utils/redux.utils';

const Vehicle = {
  createVehicle: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "vehicle/create_vehicle"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  editVehicle: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "vehicle/edit_vehicle"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getVehicle: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "vehicle/get_vehicle"
      instance().post(url, body).then(res => {
        setVehicle(res?.data?.data)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getManyVehicle: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "vehicle/get_many_vehicle"
      instance().post(url, body).then(res => {
        setManyVehicle(res?.data?.data?.docs)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  deleteVehicle: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "vehicle/delete_vehicle"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getAllVehicle: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "vehicle/get_all_vehicle"
      instance().post(url,body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
}

export default Vehicle
