import React, { useState } from "react";
import { customAlphabet } from "nanoid";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { BookingFilter, CheckinFilter, DriverFilter, VehicleFilter } from "constants/user.constant";

export const getBaseURL = () => {
  // let baseURL = 'https://api.fullfily.com'
  // let baseURL = 'https://fullfily.augmo.io'
  let baseURL = "http://localhost:8001";
  // baseURL = "https://fullfily.augmo.io";
  // let baseURL = "https://api.fullfily.com";

  if (process.env.REACT_APP_NODE_ENV === "production") {
    baseURL = "https://api.fullfily.com";
    // @ts-ignore: Unreachable code error
  } else if (process.env.REACT_APP_NODE_ENV === "stage") {
    baseURL = "https://fullfily.augmo.io";
  }
  // let baseURL = 'http://localhost:8001'
  // if (process.env.REACT_APP_NODE_ENV === "development") {
  //   baseURL = 'http://localhost:8001'
  //   // baseURL = 'http://192.168.0.102:8001'
  // } else if (process.env.REACT_APP_NODE_ENV === "stage") {
  //   baseURL = 'https://stage.hellaviews.com'
  // }
  return baseURL;
};

export const useSetState = (initialState: any) => {
  const [state, setState] = useState(initialState);

  const newSetState = (newState: any) => {
    setState((prevState: any) => ({ ...prevState, ...newState }));
  };
  return [state, newSetState];
};

export const modelError = (error: any) => {
  console.log(JSON.stringify(error.response));
  if (error.response.data.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else if (error.response) {
    return error.response;
  } else {
    return error;
  }
};

export const nanoid = () => {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoId = customAlphabet(alphabet, 10);
  return nanoId();
};

export const Options = callBack => {
  const options = {
    onUploadProgress: progressEvent => {
      const { total, loaded } = progressEvent;
      const completePercentage: any = (loaded / total) * 100;
      callBack(parseInt(completePercentage));
    },
  };
  return options;
};

export const removeEmptyValues = (object = {}) => {
  const data = {};
  Object.keys(object).forEach(item => {
    if (typeof object[item] === "boolean") {
      data[item] = object[item];
    } else if (object[item]) {
      data[item] = object[item];
    }
  });
  return data;
};

export const getNestedObjectValue = (nestedObj, path) => {
  const pathArr = path.split(".");
  return pathArr.reduce((obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined), nestedObj);
};
export const toastifyError = (text?: any) => {
  toast.error(text, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const toastify = (text?: any) => {
  toast(text, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const ErrorMessage = error => {
  toast.error(error);
};

export const upperCase = (text: string): string => {
  text = text.toUpperCase();
  text = text.replace(/_/g, " ");
  return text;
};

export const useQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

export const checkIfValidImage = url => {
  if (url?.length > 0 && url[0] !== undefined) {
    if (!url) {
      return false;
    }
    if (Array.isArray(url) && url.length) {
      url = url[0];
    }
    const urlSplit = url.split(".");
    const ext = urlSplit[urlSplit.length - 1];
    if (ext === "jpg" || ext === "jpeg" || ext === "png") {
      return true;
    }
  } else {
    return true;
  }
  return false;
};

export const filenameFromURL = url => {
  if (!url) {
    return false;
  }
  if (Array.isArray(url) && url.length) {
    url = url[0];
  }
  const urlSplit = url.split("/");
  const filename = urlSplit[urlSplit.length - 1];
  return filename;
};

export const printDiv = divName => {
  let printContents = document.getElementById(divName)?.innerHTML;
  let originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents || originalContents;

  window.print();

  document.body.innerHTML = originalContents;
};

export const timeConvert = (seconds: any) => {
  var days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * (24 * 60 * 60);
  var hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  var minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return (0 < days ? days + "d " : "") + (0 < hours ? hours + "h " : "") + minutes + "m";
};

export const timeConvertStatus = (seconds: any) => {
  var days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * (24 * 60 * 60);
  var hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  var minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return (0 < days ? days + "day " : "") + (0 < hours ? hours + "hours " : "") + minutes + "mins";
};

export const capitalizeFirstLetter = (string: string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return "";
  }
};

export const checkinApiCall = (startDate: any, endDate: any, city: string, vehicle: string, store: string, driver: string, status: string) => {
  if (
    (city.length && !CheckinFilter.includes(city)) ||
    (store.length && !CheckinFilter.includes(store)) ||
    (vehicle.length && !CheckinFilter.includes(vehicle)) ||
    (driver.length && !CheckinFilter.includes(driver)) ||
    (status.length && !CheckinFilter.includes(status)) ||
    typeof startDate !== "string" ||
    typeof endDate !== "string"
  ) {
    return true;
  } else return false;
};

export const driverApiCall = (startDate: any, endDate: any, city: string, status: string, onboarded: string) => {
  if (
    typeof startDate !== "string" ||
    typeof endDate !== "string" ||
    (city.length && !DriverFilter.includes(city)) ||
    (status.length && !DriverFilter.includes(status)) ||
    (onboarded.length && !DriverFilter.includes(onboarded))
  ) {
    return true;
  } else return false;
};

export const vehicleApiCall = (startDate: any, endDate: any, model: string, type: string) => {
  if (
    typeof startDate !== "string" ||
    typeof endDate !== "string" ||
    (model.length && !VehicleFilter.includes(model)) ||
    (type.length && !VehicleFilter.includes(type))
  ) {
    return true;
  } else return false;
};

export const bookingApiCall = (startDate: any, endDate: any, driver: string, city: string, status: string, store: any, payment: string) => {
  if (
    typeof startDate !== "string" ||
    typeof endDate !== "string" ||
    (driver.length && !BookingFilter.includes(driver)) ||
    (city.length && !BookingFilter.includes(city)) ||
    (status.length && !BookingFilter.includes(status)) ||
    (store.length && !BookingFilter.includes(store)) ||
    (payment.length && !BookingFilter.includes(payment))
  ) {
    return true;
  } else return false;
};

const Functions = {
  useSetState,
  getBaseURL,
  modelError,
  nanoid,
  removeEmptyValues,
  getNestedObjectValue,
  printDiv,
  capitalizeFirstLetter,
  timeConvert,
};

export default Functions;
