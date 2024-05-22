
import { Functions } from '../utils/imports.utils';
import instance from "../utils/axios.utils"
import { setManyOrganization, setOrganization } from 'utils/redux.utils';

const Organization = {
  createOrganization: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "organization/create_organization"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  editOrganization: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "organization/edit_organization"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getOrganization: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "organization/get_organization"
      instance().post(url, body).then(res => {
        setOrganization(res?.data?.data)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getManyOrganization: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "organization/get_many_organization"
      instance().post(url, body).then(res => {
        setManyOrganization(res?.data?.data?.docs)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  deleteOrganization: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "organization/delete_organization"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getAllOrganization: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "organization/get_all_organization"
      instance().post(url,body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
}

export default Organization
