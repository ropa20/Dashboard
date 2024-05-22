import * as yup from "yup";
// const phoneRegExp  = /^(\+91|0)?[0-9]{10}$/
 const phoneRegExp = /^(\+91|0)?[1-9][0-9]{9}$/
export const test = yup.object({
  name: yup.string().required("Please enter name"),
});

export const organization = yup.object({
  city: yup.string().required('Please select a city'),
  name: yup.string().required("Please enter name").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  gst: yup.string().required("Please enter gst").matches(
    /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
    "Please enter valid GST Number"
  ),
  contract_start_date: yup.date().required("Please enter contract start date"),
  contract_end_date: yup.date().required("Please enter contract end date"),
});

export const editOorganization = yup.object({
  city:yup.string().required('Please select a city'),
  name: yup.string().required("Please enter name").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  gst: yup.string().required("Please enter gst").matches(
    /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
    "Please enter valid GST Number"
  ),
});

export const store = yup.object({
  name: yup.string().required("Please enter name").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  type: yup.string().required("Please enter type"),
  address: yup.mixed().required("Please enter address"),
  city: yup.string().required("Please select a city"),
  phone: yup
    .string()
    .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, "Phone number is not valid")
    .required("Please enter phone").min(10,"Phone number is not valid").max(10,"Phone number is not valid"),

});

export const address = yup.object({
  name: yup.string().required("Please enter name").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  phone: yup
    .string()
    .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, "Phone number is not valid")
    .required("Please enter phone"),
  address: yup.string().required("Please enter address"),
  city: yup.string().required("Please enter city").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  pincode: yup.number().required("Please enter pincode"),
  landmark: yup.string().optional(),
});
export const user = yup.object({
  city : yup.string().required("Please select a city"),
  email: yup.string().required("Please enter email"),
  role: yup.string().required("Please select role"),
  password: yup.string().required("Please enter password"),
  phone:  yup
  .string()
  .required("Please enter phone").min(10,"Phone number is not valid").max(10,"Phone number is not valid"),
  username: yup.string().required("Please enter name"),

});
export const userEdit = yup.object({
  email: yup.string().required("Please enter email"),
  role: yup.string().required("Please select role"),

});
export const vehicle = yup.object({
  city: yup.string().required("Please select a city"),
  model: yup.string().required("Please enter model"),
  hub: yup.string().required("Please select a hub"),
  number: yup.string().required("Please enter number"),
  type: yup.string().required("Please enter type"),
});
export const hub = yup.object({
  city: yup.string().required("Please select a city"),
  name: yup.string().required("Please enter name").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  two_wheeler_count:yup.number().required('Please enter available 2W vehicles '),
  three_wheeler_count:yup.number().required('Please enter available 3W vehicles '),
  address: yup.mixed().required("Please choose address"),
});
export const outsource = yup.object({
  city: yup.string().required("Please select a city"),
  organization: yup.mixed().required("Please enter organization"),
  store: yup.mixed().required("Please enter store"),
  driver: yup.mixed().required("Please enter driver"),
  start_time: yup.string().required("Please enter start time"),
  end_time: yup.string().required("Please enter end time"),
});
export const payout = yup.object({
  driver: yup.mixed().required("Please choose driver"),
  amount: yup.string().required("Please enter amount"),
  payment_type: yup.string().required("Please enter payment type"),
  payment_id: yup.string().required("Please enter payment id"),
  city: yup.string().required("Please select a city"),
});
export const driver = yup.object({
  phone: yup
    .string().min(10).required("Please enter mobile phone").matches(phoneRegExp,"Please enter valid mobile number"),
    // .required("Please enter phone").min(10,"Phone number is not valid").max(10,"Phone number is not valid"),
  gender: yup.string().required("Please select gender"),
  name: yup.string().required("Please enter name").matches(/^[a-zA-Z\s-]+$/,"Please enter alphabet letters only"),
  city: yup.string().required("Please select a city"),
  status:yup.string().required("Please select a status"),
  education: yup.string().required("Please enter education"),
  parents_name: yup.string().required("Please enter parents or spouse name").matches(/^[a-zA-Z\s-]+$/,"Please enter alphabet letters only"),
  own_vehicle:yup.boolean().required('Please select own vehicle'),
  // passport_size_photo: yup.string().required("Please upload passport size photo"),
  // aadhaar_card_front: yup.string().required("Please upload aadhaar card front"),
  // aadhaar_card_back: yup.string().required("Please upload aadhaar card back"),
  // driving_licence_front: yup.string().required("Please upload driving licence front"),
  // driving_licence_back: yup.string().required("Please upload driving licence back"),
  primary_address: yup.object({
    address: yup.string().required("Please enter address"),
    city: yup.string().required("Please enter city").matches(/^[a-zA-Z\s-]+$/ ,"Please enter alphabet letters only"),
    pincode: yup.string().required("Please enter pincode").matches(/^\d+$/ ,"Please enter number only" ),
    location: yup.string().required("Please enter location"),
  }),
  bank_details: yup.object({
    customer_name: yup.string().required("Please enter customer name ").matches(/^[a-zA-Z\s-]+$/,"Please enter alphabet letters only"),
    account_number: yup.string().required("Please enter account number").matches(/^[a-zA-Z0-9]*$/ ,"Please enter valid number"),
    ifsc_code: yup.string().required("Please enter IFSC Code").matches(/^[^*|\":<>[\]{}`\\()';@#%&$]+$/, "Special characters not allowed"),
    passbook:yup.string().required("Please upload bank passbook / cheque")
  }),
});
export const driverOwnVehicle = yup.object({
  phone: yup
    .string()
    .required("Please enter phone").min(10,"Phone number is not valid").max(13,"Phone number is not valid"),
  city: yup.string().required("Please select a city"),
  gender: yup.string().required("Please select gender"),
  name: yup.string().required("Please enter name").matches(/^[a-zA-Z\s-]+$/,"Please enter alphabet letters only"),
  education: yup.string().required("Please enter education"),
  parents_name: yup.string().required("Please enter parents or spouse name").matches(/^[a-zA-Z\s-]+$/,"Please enter alphabet letters only"),
  own_vehicle:yup.boolean().required('Please select own vehicle'),
  passport_size_photo: yup.string().required("Please upload passport size photo"),
  aadhaar_card_front: yup.string().required("Please upload aadhaar card front"),
  aadhaar_card_back: yup.string().required("Please upload aadhaar card back"),
  driving_licence_front: yup.string().required("Please upload driving licence front"),
  driving_licence_back: yup.string().required("Please upload driving licence back"),
  primary_address: yup.object({
    address: yup.string().required("Please enter address"),
    city: yup.string().required("Please enter city").matches(/^[a-zA-Z\s-]+$/ ,"Please enter alphabet letters only"),
    pincode: yup.string().required("Please enter pincode").matches(/^\d+$/ ,"Please enter number only"),
    location: yup.string().required("Please enter location"),
  }),
  bank_details: yup.object({
    customer_name: yup.string().required("Please enter customer name ").matches(/^[a-zA-Z\s-]+$/,"Please enter alphabet letters only"),
    account_number: yup.string().required("Please enter account number").matches(/^[a-zA-Z0-9]*$/ ,"Please enter valid number"),
    ifsc_code: yup.string().required("Please enter IFSC Code").matches(/^[^*|\":<>[\]{}`\\()';@#%&$]+$/, "Special characters not allowed"),
    passbook:yup.string().required("Please upload bank passbook / cheque")
  }),
});
export const booking = yup.object({
  delivery_address: yup.mixed().required("Please enter delivery address"),
  city: yup.string().required("Please select a city")

});
export const stores = yup.object({
  name: yup.string().required("Please enter name").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  type: yup.string().required("Please enter type"),
  organization: yup.string().required("Please enter organization"),
});

export const city = yup.object({
  city_name: yup.string().required("Please enter city name").matches(/^[aA-zZ\s]+$/, "City name should contains only alphabets"),
  city_value: yup.string().required("Please enter city value ").matches(/^[A-Z_ ]*$/i,"Special characters are not allowed"),
});
// _NV_