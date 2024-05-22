import { Functions } from "../utils/imports.utils";
import instance from "../utils/axios.utils";
import { setManyOutsource, setOutsource } from "utils/redux.utils";

const Outsource = {
  createOutsource: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "outsource/create_outsource";
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
  editOutsource: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "outsource/edit_outsource";
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
  getOutsource: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "outsource/get_outsource";
      instance()
        .post(url, body)
        .then(res => {
          setOutsource(res?.data?.data);
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  getManyOutsource: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "outsource/get_many_outsource";
      instance()
        .post(url, body)
        .then(res => {
          setManyOutsource(res?.data?.data?.docs);
          resolve(res.data);
        })
        .catch(error => {
          reject(Functions.modelError(error));
        });
    });
    return promise;
  },
  deleteOutsource: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "outsource/delete_outsource";
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
  getAllOutsource: (body) => {
    let promise = new Promise((resolve, reject) => {
      let url = "outsource/get_all_outsource";
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

export default Outsource;
