
import { Functions } from '../utils/imports.utils';
import instance from "../utils/axios.utils"
import { setManyCheckin, setCheckin } from 'utils/redux.utils';

const Checkin = {
  createCheckin: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "checkin/create_checkin";
      instance()
        .post(url, body)
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  editCheckin: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "checkin/edit_checkin";
      instance()
        .post(url, body)
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  getCheckin: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "checkin/get_checkin";
      instance()
        .post(url, body)
        .then(res => {
          setCheckin(res?.data?.data);
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  getManyCheckin: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "checkin/get_many_checkin";
      instance()
        .post(url, body)
        .then(res => {
          setManyCheckin(res?.data?.data?.docs);
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  deleteCheckin: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "checkin/delete_checkin";
      instance()
        .post(url, body)
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  getAllCheckin: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "checkin/get_all_checkin";
      instance()
        .post(url, body)
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  getChekinDriver: (body?) => {
    let promise = new Promise((resolve, reject) => {
      let url = "checkin/get_checkin_driver";
      instance()
        .post(url,body)
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  getChekinDriverCount: (body?) => {
    let promise = new Promise((resolve, reject) => {
      let url = "checkin/get_checkin_driver_count";
      instance()
        .post(url,body)
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  getChekinBreakCount: (body?) => {
    let promise = new Promise((resolve, reject) => {
      let url = "checkin/get_checkin_break_count";
      instance()
        .post(url,body)
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  
};

export default Checkin
