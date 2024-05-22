import { Functions } from "../utils/imports.utils";
import instance from "../utils/axios.utils";

const Status = {
  createStatus: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "status/create_status";
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
  }
};

export default Status;
