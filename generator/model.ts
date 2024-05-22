// @ts-nocheck
import { Functions } from '../utils/imports.utils';
import instance from "../utils/axios.utils"
import { setMany_MN_, set_MN_ } from 'utils/redux.utils';

const _MN_ = {
  create_MN_: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "_MNS_/create__MNS_"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  edit_MN_: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "_MNS_/edit__MNS_"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  get_MN_: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "_MNS_/get__MNS_"
      instance().post(url, body).then(res => {
        set_MN_(res?.data?.data)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getMany_MN_: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "_MNS_/get_many__MNS_"
      instance().post(url, body).then(res => {
        setMany_MN_(res?.data?.data?.docs)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  delete_MN_: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "_MNS_/delete__MNS_"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
}

export default _MN_
