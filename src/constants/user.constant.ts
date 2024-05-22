import { DRIVER_STATUS } from "./driver.constant";

export enum ROLES {
  ADMIN = 'ADMIN',
  HUB_INCHARGE = "HUB_INCHARGE",
  ORG_ADMIN = "ORG_ADMIN",
  STORE_ADMIN = "STORE_ADMIN",
}



export const UserPermission = [
  "Dashboard",
  "Organization",
  "City",
  "User",
  "Booking",
  "Driver",
  "Live location",
  "Checkin",
  "Vehicle",
  "Hub",
  "Outsource",
  "Payout",
];

export const DocumentList = [
  "Rejection for aadhar card front",
  "Rejection for aadhar card back",
  "Rejection for passport size photo",
  "Rejection for driving license back",
  "Rejection for pan card",
  "Rejection for vehicle insurance",
  "Rejection for rc book front",
  "Rejection for rc book back",
];

export const DriverStatus = [
  DRIVER_STATUS.REQUESTED,
  DRIVER_STATUS.APPROVED,
  DRIVER_STATUS.RESIGNED,
  DRIVER_STATUS.TERMINATED,
  "DELETE REQUESTED"
];

export const DriverSearch = [{

}]

export const VehicleType = [
  {
    label:'ALL VEHICLE TYPE',
    value:'all_types'
  },
  {
    label: "2W",
    value: "2W",
  },
  {
    label: "3W",
    value: "3W",
  },
  {
    label: "4W",
    value: "4W",
  },
];

export const BookingStatus = [
  { label: "ALL STATUS", value: "all_status" },
  { label: "CANCELLED", value: "CANCELLED" },
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "LIVE", value: "LIVE" },
  { label: "MANUAL", value: "MANUAL" },
];

export const PaymentType = [
  { 
    label: "ALL PAYMENT", 
    value: "all_payment" 
  },
  {
    label: "COD",
    value: "COD",
  },
  {
    label: "ONLINE",
    value: "Online",
  },
];

export const CheckinStatus = [
  { label: "ALL", value: "all_status" },
  {
    label: "ACTIVE",
    value: "active",
  },
  {
    label: "INACTIVE",
    value: "in_active",
  },
  {
    label: "BREAK",
    value: "break",
  },
];

export const CheckinFilter = ["all_cities", "all_vehicle", "all_stores", "all_drivers","all_status"];

export const DriverFilter = ["all_cities", "all_status", "all_onboarded"];

export const VehicleFilter = ['all_models','all_types']

export const BookingFilter = ["all_cities", "all_drivers", "all_status", "all_stores", "all_payment"];

export const Latlng = [
  {
    lat: 13.07761796658607,
    lng: 80.22608710276693,
  },
  {
    lat: 13.077952384836156,
    lng: 80.19317103637847,
  },
  {
    lat:13.064617105788534,
    lng:80.1981063005697,
  },
  {
    lat: 13.059015237654994,
    lng: 80.21261168576786,
  },
  {
    lat: 13.059015237658774,
    lng: 80.21261168576742,
  },
  {
    lat: 13.059015237657744,
    lng: 80.21261168575072,
  },
  {
    lat:13.064617105788554,
    lng:80.1981063005647,
  },
  {
    lat: 13.059015237655964,
    lng: 80.2126116857666,
  },
  {
    lat: 13.059015237658474,
    lng: 80.21261168576782,
  },
  {
    lat: 13.059015237657734,
    lng: 80.21261168575092,
  },
  {
    lat: 13.059015237667994,
    lng: 80.21261168579786,
  },
  {
    lat: 13.059015237478774,
    lng: 80.21261168577942,
  },
  {
    lat: 13.059015237656844,
    lng: 80.212611685753372,
  },
  {
    lat:13.064617105788454,
    lng:80.19810630056647,
  },
  {
    lat: 13.059015237655964,
    lng: 80.21261168576786,
  },
  {
    lat: 13.0590152376584554,
    lng: 80.2126116857674562,
  },
  {
    lat: 13.0590152376577874,
    lng: 80.212611685750672,
  },
  {
    lat:13.0646171067788454,
    lng:80.19810635056647,
  },
  {
    lat: 13.05901523337655964,
    lng: 80.212611678576786,
  },
  {
    lat: 13.06790152376584554,
    lng: 80.20526116857674562,
  },
  {
    lat: 13.03490152376577874,
    lng: 80.21049611685750672,
  },
  {
    lat: 13.0679015237657744,
    lng: 80.217861168575072,
  },
  {
    lat:13.0678617105788554,
    lng:80.19781063005647,
  },
  {
    lat: 13.0566015237655964,
    lng: 80.26786116857666,
  },
  {
    lat: 13.0958015237658474,
    lng: 80.215561168576782,
  },
 
  {
    lat: 13.0546015237667994,
    lng: 80.21261168579786,
  },
  // {
  //   lat: 13.03459015237478774,
  //   lng: 80.2455261168577942,
  // },
  // {
  //   lat: 13.055669015237656844,
  //   lng: 80.66612611685753372,
  // },
  // {
  //   lat:13.0655617105788454,
  //   lng:80.1966610630056647,
  // },
  // {
  //   lat: 13.06669015237655964,
  //   lng: 80.2167261168576786,
  // },
  // {
  //   lat: 13.56766790152376584554,
  //   lng: 80.274726116857674562,
  // },
  // {
  //   lat: 13.056790152376577874,
  //   lng: 80.216882611685750672,
  // },
  // {
  //   lat:13.065677846171067788454,
  //   lng:80.1667810635056647,
  // },
  // {
  //   lat: 13.06784801523337655964,
  //   lng: 80.212611678576786,
  // },
  // {
  //   lat: 13.0648484790152376584554,
  //   lng: 80.20526116857674562,
  // },
  // {
  //   lat: 13.054490152376577874,
  //   lng: 80.21074749611685750672,
  // },
  
  
];
