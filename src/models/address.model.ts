
import { Functions } from '../utils/imports.utils';
import instance from "../utils/axios.utils"

const Address = {
  createAddress: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "address/create_address"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  editAddress: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "address/edit_address"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getAddress: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "address/get_address"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getManyAddress: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "address/get_many_address"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  deleteAddress: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "address/delete_address"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
}

export default Address
