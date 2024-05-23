import React, { useEffect } from "react";
import History from "components/history/history.component";
import Add from "components/add/add.component";
import Button from "common_components/ui/button/button.ui";
import "./add_booking.screen.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { removeEmptyValues, toastifyError, useSetState } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import { IAddValues } from "utils/interface.utils";
import { ROLES } from "constants/user.constant";
import { useSelector, useDispatch } from "react-redux";
import { ORG_TYPE } from "constants/org.constant";
import { PAYMENT_TYPE } from "constants/booking.constant";

const role = localStorage.getItem("role");
const store = localStorage.getItem("store");
const org = localStorage.getItem("org");

export default function AddBooking() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pathArr = pathname.split("/");
  const isEditable = pathArr.includes("edit_booking");
  const initialValue = {
    store: "",
    delivery_address: "",
    driver: "",
    booking_id: "",
    status: "",
    cod_amount: "",
    payment_type:"",
    city:''
  };
  const selectOption = [{ label: "Test", value: "test" }];

  const [state, setState] = useSetState({
    data: initialValue,
    loading: false,
    selectOptions: selectOption,
    org: org,
    buttonDisabled:false
  });

  let inputFields: IAddValues[] = [
    { label: "City*", key: "city", type: "city" },
    { label: "Delivery address*", key: "delivery_address", type: "address" },
    { label: "Driver*", key: "driver", type: "store_driver" },
    {
      label: "Payment Type*",
      key: "payment_type",
      options: [
        {
          label: "COD",
          value: "COD",
        },
        {
          label: "Online",
          value: "Online",
        },
      ],
      type: "payment_type",
    },
    { label: "Booking id", key: "booking_id", type: "string" },
  ];

  if (state.payment_type === PAYMENT_TYPE.COD) {
    inputFields.push({ label: "Amount", key: "cod_amount", type: "number" });
  }
  if (role === ROLES.ORG_ADMIN) {
    inputFields.unshift({ label: "Store*", key: "store", type: "store" });
  }

  if (role === ROLES.ADMIN) {
    inputFields.unshift({ label: "Pickup address*", key: "pickup_address", type: "address" });
  }

  if(state.org?.type === ORG_TYPE.DYNAMIC){
    inputFields = inputFields.filter(field => field.key !== "driver");
  }

  useEffect(() => {
    if (isEditable) {
      GetBooking();
    }
  }, []);

  useEffect(() => {
    if(org) {
      getOrganization();
    }
  }, [])
  

  const GetBooking = async () => {
    try {
      setState({ loading: false });
      const res: any = await Models.booking.getBooking({
        id: params.id,
      });
      const data = {};
      if (res?.data) {
        Object.keys(initialValue).forEach(item => {
          data[item] = res.data[item] || initialValue[item];
        });
        setState({ data });
      }
      setState({ loading: false });
    } catch (error) {
      toastifyError(error);
      console.log(error);
    }
  };

  const getOrganization = async () => {
    try {
      const res: any = await Models.organization.getOrganization({
        organization_id: org,
      });
      setState({ org: res.data });
    } catch (error) {
      console.log(error);
      toastifyError(error);
    }
  };

  const handleEdit = async values => {
    setState({buttonDisabled:true})
    try {
      const data = removeEmptyValues(values);
      await Models.booking.editBooking({
        id: params.id,
        ...data,
      });
      navigate("/booking");
    } catch (err) {
      setState({buttonDisabled:false})
      toastifyError(err);
      console.log(err);
    }
  };

  const handleCreate = async values => {
    setState({buttonDisabled:true})
    try {
      const data: any = removeEmptyValues(values);
      console.log(data);
      if (state.logo) data.logo = state.logo;
      if (store) {
        data.store = store;
      }
      if (org) {
        data.organization = org;
      }
      await Models.booking.createBooking(data);
      navigate("/booking");
    } catch (err) {
      setState({buttonDisabled:false})
      toastifyError(err);
      console.log(err);
    }
  };

  return (
    <div className="add_booking_container">
      <div className="add_booking_wrapper">
        <History name={state?.data?.name} />
        <div className="add_booking_body_container">
          <Add
            payment_type={(type)=>setState({payment_type:type.value})}
            title={`${isEditable ? "Edit" : "Add"} Booking`}
            actions={[{ link: "/", icon: "view" }]}
            data={state.data}
            values={inputFields}
            initialValues={initialValue}
            validationSchema="booking"
            onSubmit={isEditable ? handleEdit : handleCreate}
            buttons={<AddButton buttonDisabled={state.buttonDisabled} />}
            hasFiles
          />
        </div>
      </div>
    </div>
  );

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
              <Button buttonDisabled={props.buttonDisabled} buttonType="submit" value="Save" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
