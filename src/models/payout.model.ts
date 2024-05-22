import { Functions } from "../utils/imports.utils";
import instance from "../utils/axios.utils";
import { setManyPayout, setPayout } from "utils/redux.utils";

const Payout = {
  createPayout: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "payout/create_payout";
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
  editPayout: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "payout/edit_payout";
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
  getPayout: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "payout/get_payout";
      instance()
        .post(url, body)
        .then(res => {
          setPayout(res?.data?.data);
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  getManyPayout: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "payout/get_many_payout";
      instance()
        .post(url, body)
        .then(res => {
          setManyPayout(res?.data?.data?.docs);
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  deletePayout: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "payout/delete_payout";
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
  getAllPayout: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "payout/get_all_payout";
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

export default Payout;
