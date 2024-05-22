
import { Functions } from '../utils/imports.utils';
import instance from "../utils/axios.utils"
import { setManyBooking, setBooking } from 'utils/redux.utils';

const Booking = {
  createBooking: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "booking/create_booking"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  editBooking: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "booking/edit_booking"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getBooking: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "booking/get_booking"
      instance().post(url, body).then(res => {
        setBooking(res?.data?.data)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getManyBooking: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "booking/get_many_booking"
      instance().post(url, body).then(res => {
        setManyBooking(res?.data?.data?.docs)
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  deleteBooking: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "booking/delete_booking"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
  getAllBooking: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "booking/get_all_booking"
      instance().post(url, body).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(Functions.modelError(error))
      })
    })
    return promise
  },
}

export default Booking
