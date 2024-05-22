import axios from "axios";
import { Functions } from "./imports.utils";
import { getBaseURL } from "./functions.utils";
// import AsyncStorage from "@react-native-community/async-storage"

// let token = localStorage.getItem("token");
export const instance = () => {
  console.log("URL", getBaseURL(), process.env.REACT_APP_NODE_ENV);

  const data = axios.create({
    baseURL: Functions.getBaseURL() + "/api/v1/",
    headers: {
      // authorization: token || "",
    },
  });
  return data;
};

// export const instance = () => {
//   const data = axios.create({
//     baseURL: Functions.getBaseURL()+"/api/v1/",
//   })
//   data.interceptors.request.use(async function (config) {
//       const accessToken = await AsyncStorage.getItem("token");
//       config.headers['authorization'] = accessToken ? accessToken : '';
//       return config;
//   });
//   return data
// }

export default instance;
