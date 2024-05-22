import { Functions } from "../utils/imports.utils";
import instance from "../utils/axios.utils";
import { setManyVehicle, setVehicle } from "utils/redux.utils";

const LiveLocation = {
  getCurrentLocation: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "location/get_current_location";
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

  getManyLocation: body => {
    let promise = new Promise((resolve, reject) => {
      let url = "location/get_many_location";
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
};

export default LiveLocation;
