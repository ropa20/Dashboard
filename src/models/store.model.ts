
import { Functions } from '../utils/imports.utils';
import instance from "../utils/axios.utils"

const Store = {
  createStore: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "store/create_store"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  editStore: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "store/edit_store"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getStore: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "store/get_store"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getManyStore: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "store/get_many_store"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  deleteStore: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "store/delete_store"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
}

export default Store
