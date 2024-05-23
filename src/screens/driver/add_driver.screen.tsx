import React, { useEffect } from "react";
import History from "components/history/history.component";
import Add from "components/add/add.component";
import Assets from "imports/assets.import";
import Button from "common_components/ui/button/button.ui";
import "./add_driver.screen.scss";
import UploadButton from "common_components/ui/upload_button/upload_button.ui";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { removeEmptyValues, useSetState, toastifyError } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import { IAddValues } from "utils/interface.utils";
import { setDriverQuery } from "utils/redux.utils";
import { DRIVER_STATUS } from "constants/driver.constant";
import _ from "lodash";

export default function AddDriver() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pathArr = pathname.split("/");
  const isEditable = pathArr.includes("edit_driver");
  const userId = localStorage.getItem('user_id')

  let initialValue = {
    phone: "",
    name: "",
    email: "",
    city:"",
    education: "",
    gender: "",
    bank_details: {
      customer_name: "",
      account_number: "",
      ifsc_code: "",
      passbook:""
    },
    parents_name: "",
    emergency_contact: "",
    own_vehicle: false,
    primary_address: {
      address: "",
      city: "",
      pincode: "",
      location: "",
    },
    secondary_address: {
      address: "",
      city: "",
      pincode: "",
      location: "",
    },
    vehicle_insurance: "",
    passport_size_photo: "",
    aadhaar_card_front: "",
    aadhaar_card_back: "",
    driving_licence_front: "",
    driving_licence_back: "",
    pan_card: "",
    status:'',
    remarks:''
  };

  const ownVehicleInitialValue = {
    vehicle_insurance: "",
    passport_size_photo: "",
    aadhaar_card_front: "",
    aadhaar_card_back: "",
    driving_licence_front: "",
    driving_licence_back: "",
    pan_card: "",
  };
  let initialValueData;
  let inputValues;

  const selectOption = [{ label: "Test", value: "test" }];

  const [state, setState] = useSetState({
    data: initialValue,
    loading: false,
    selectOptions: selectOption,
    own_vehicle: false,
    buttonDisabled:false
  });

  const initialValues = () => {
      if (state.own_vehicle) {
        return (initialValue = Object.assign(initialValue, ownVehicleInitialValue));
      } else {
        return (initialValue = initialValue);
      }
  };
  const inputFields: IAddValues[] = [
    { label: "City*", key: "city", type: "city" },
    { label: "Name*", key: "name", type: "string" },
    {
      label: "Gender*",
      key: "gender",
      options: [
        {
          label: "Male",
          value: "Male",
        },
        {
          label: "Female",
          value: "Female",
        },
      ],
      type: "select",
    },
    { label: "Parents/Spouse Name*", key: "parents_name", type: "string" },
    { label: "Email", key: "email", type: "string" },
    { label: "Phone*", key: "phone", type: "string" },
    { label: "Emergency contact", key: "emergency_contact", type: "string" },
    { label: "Education*", key: "education", type: "string" },
    { label: "Status", key: "status", type: "driver_status" },
    { label: "Remarks", key: "remarks", type: "remarks" },
    
    { label: "Bank Details*", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "Customer name*", key: "bank_details.customer_name", type: "string", isNested: true },
    { label: "Account number*", key: "bank_details.account_number", type: "string", isNested: true },
    { label: "IFSC code*", key: "bank_details.ifsc_code", type: "string", isNested: true },
    { label: "Bank Passbook / Cheque book", key:"bank_details.passbook", type: "file", isNested: true },
    { label: "Bank passbook/Cheque book", key:"bank_details.passbook", type: "passbook", isNested: true },
    { label: "", key: "title", type: "title" },

    { label: "Primary Address*", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "Address*", key: "primary_address.address", type: "string", isNested: true },
    { label: "city*", key: "primary_address.city", type: "string", isNested: true },
    { label: "Area/Location*", key: "primary_address.location", type: "string", isNested: true },
    { label: "pincode*", key: "primary_address.pincode", type: "string", isNested: true },

    { label: "Secondary Address(Optional)", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "Address", key: "secondary_address.address", type: "string", isNested: true },
    { label: "city", key: "secondary_address.city", type: "string", isNested: true },
    { label: "Area/Location", key: "secondary_address.location", type: "string", isNested: true },
    { label: "pincode", key: "secondary_address.pincode", type: "string", isNested: true },

    {
      label: "Own Vehicle*",
      key: "own_vehicle",
      options: [
        {
          label: "Yes",
          value: true,
        },
        {
          label: "No",
          value: false,
        },
      ],
      type: "own_vehicle",
    },
  ];

  const ownVehicleInputFields: IAddValues[] = [
    { label: "Passport Size Photo*", key: "passport_size_photo", type: "file" },
    { label: "Aadhaar Card Front*", key: "aadhaar_card_front", type: "file" },
    { label: "Aadhaar Card Back*", key: "aadhaar_card_back", type: "file" },
    { label: "Driving Licence Front*", key: "driving_licence_front", type: "file" },
    { label: "Driving Licence Back*", key: "driving_licence_back", type: "file" },
    { label: "Pan card", key: "pan_card", type: "file" },
    { label: "Vehicle insurance", key: "vehicle_info.insurance", type: "file" },
    { label: "Rc Book Front", key: "vehicle_info.rc_book", type: "file" , isNested: true },
    { label: "Rc Book Back", key: "vehicle_info.rc_book_back", type: "file" , isNested: true },
  ];

  const inputField: any = () => {
    if (state.own_vehicle) {
      return inputFields.concat(ownVehicleInputFields);
    } else  {
      return inputFields;
    }
  };

  useEffect(() => {
    if (isEditable) {
      GetDriver();
    }
  }, []);

  const checkOwnVehicle = (value?: any) => {
    setState({ own_vehicle: value.value });
  };

  const GetDriver = async () => {
    try {
      setState({ loading: false });
      const res: any = await Models.driver.getDriver({
        driver_id: params.id,
      });
      const data = {};
      if (res?.data) {
        Object.keys(initialValue).forEach(item => {
          data[item] = res.data[item];
        });
        setState({ own_vehicle: res.data.own_vehicle });
        setState({ data });
      }
      setState({ loading: false });
    } catch (error) {
      toastifyError(error);
      console.log(error);
    }
  };

  const handleEdit = async values => {
    setState({buttonDisabled:true})
    if (_.isEmpty(values.remarks) && !_.isEmpty(values.status)) {
      toastifyError("Please enter remarks");
      setState({ buttonDisabled: false });
    } 
    else {
      try {
        const data: any = removeEmptyValues(values);
        if(data.phone) {
          data.phone = data.phone.toString().replace("+91", '');
          data.phone = "+91" + data.phone;
        }
        await Models.driver.editDriver({
          driver_id: params.id,
          ...data,
        });
        navigate("/driver");
      } catch (err: any) {
        setState({buttonDisabled:false})
        toastifyError(err);
        console.log(err);
      }
    };
    }

  const handleEditLogo = async url => {
    try {
      if (isEditable) {
        await Models.driver.editDriver({
          driver_id: params.id,
          passport_size_photo: url,
        });
        GetDriver();
      } else {
        setState({ passport_size_photo: url });
      }
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };
  const handleCreate = async values => {
    setState({ buttonDisabled: true });
    if (_.isEmpty(values.remarks) && !_.isEmpty(values.status)) {
      toastifyError("Please enter remarks");
      setState({ buttonDisabled: false });
    } else {
      try {
        if (values.secondary_address.address?.length === 0) {
          delete values.secondary_address.address;
        }
        if (values.secondary_address.city?.length === 0) {
          delete values.secondary_address.city;
        }
        if (values.secondary_address.location?.length === 0) {
          delete values.secondary_address.location;
        }
        if (values.secondary_address.pincode?.length === 0) {
          delete values.secondary_address.pincode;
        }

        const data: any = removeEmptyValues(values);
        if (data.phone) {
          data.phone = data.phone.toString().replace("+91", "");
          data.phone = "+91" + data.phone;
        }
        if (state.passport_size_photo) data.passport_size_photo = state.passport_size_photo;
        if (values.status === DRIVER_STATUS.APPROVED) data["onboarded_by"] = userId;
        await Models.driver.createDriver(data);
        navigate("/driver");
      } catch (err: any) {
        setState({ buttonDisabled: false });
        toastifyError(err);
        console.log(err);
      }
    }
  };
  return (
    <div className="add_driver_container">
      <div className="add_driver_wrapper">
        <History name={state?.data?.name} />
        <div className="add_driver_body_container">
          <Add
            vehicle={state.own_vehicle}
            ownVehicle={value => checkOwnVehicle(value)}
            title={`${isEditable ? "Edit" : "Add"} Driver`}
            actions={[{ link: "/", icon: "view" }]}
            data={state.data}
            values={inputField()}
            initialValues={initialValues()}
            validationSchema={state.own_vehicle?"driverOwnVehicle":"driver"}
            onSubmit={isEditable ? handleEdit : handleCreate}
            logo={<Logo />}
            buttons={<AddButton buttonDisabled={state.buttonDisabled} />}
            hasFiles
          />
        </div>
      </div>
    </div>
  );

  function Logo() {
    return (
      <div className="add_logo_container">
        <div className="add_logo_wrapper">
          <div className="logo_label_container">
            <div className="logo_label caption2">Logo image</div>
          </div>
          <div className="logo_wrapper">
            <div className="logo_container">
              <img src={state?.data?.passport_size_photo || state.passport_size_photo || Assets.testPic} alt="add_logo" className="logo_image" />
            </div>
            <div className="button_container">
              <UploadButton onChange={handleEditLogo} buttonLabel="Upload new" name="File" accept="image/*" />
            </div>
            {/* {isEditable && (
              <div className="button_container">
                <Button
                  value="Remove"
                  color="white"
                  textColor="primary"
                  borderColor="primary"
                  onClick={() => handleEditLogo('')}
                />
              </div>
            )} */}
          </div>
        </div>
      </div>
    );
  }

  function AddButton(props:any) {
    return (
      <div className="view_button_container">
        <div className="view_button_wrapper">
          {isEditable ? (
            <div className="view_button">
              <Button buttonDisabled={props.buttonDisabled} value="Update" />
            </div>
          ) : (
            <div className="view_button">
              <Button buttonDisabled={props.buttonDisabled} value="Save" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
