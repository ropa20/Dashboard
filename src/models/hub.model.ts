
import { Functions } from '../utils/imports.utils';
import instance from "../utils/axios.utils"
import { setManyHub, setHub } from 'utils/redux.utils';

const Hub = {
  createHub: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "hub/create_hub"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  editHub: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "hub/edit_hub"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getHub: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "hub/get_hub"
      instance().post(url, body).then(res => {
        setHub(res?.data?.data)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getManyHub: (body?) => {
    let promise = new Promise((resolve, reject) => {
      let url = "hub/get_many_hub"
      instance().post(url,body).then(res => {
        setManyHub(res?.data?.data?.docs)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  
  getHubWithoutPagination:()=>{
    let promise = new Promise((resolve, reject) => {
      let url = "hub/get_many_hub_without_pagination"
      instance().post(url).then(res => {
        setManyHub(res?.data?.data)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  deleteHub: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "hub/delete_hub"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getAllHub: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "hub/get_all_hub"
      instance().post(url,body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
}

export default Hub
