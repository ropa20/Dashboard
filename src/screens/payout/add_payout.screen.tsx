import React, { useEffect } from "react";
import History from "components/history/history.component";
import Add from "components/add/add.component";
import Assets from "imports/assets.import";
import Button from "common_components/ui/button/button.ui";
import "./add_payout.screen.scss";
import UploadButton from "common_components/ui/upload_button/upload_button.ui";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  removeEmptyValues,
  useSetState,
  toastifyError,
} from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import { IAddValues } from "utils/interface.utils";

export default function AddPayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pathArr = pathname.split("/");
  const isEditable = pathArr.includes("edit_payout");

  const initialValue = {
    driver: "",
    user: "",
    amount: "",
    payment_type: "",
    payment_id: "",
    city: "",
  };
  const selectOption = [{ label: "Test", value: "test" }];

  const [state, setState] = useSetState({
    data: initialValue,
    loading: false,
    selectOptions: selectOption,
    buttonDisabled: false,
  });

  const inputFields: IAddValues[] = [
    { label: "City*", key: "city", type: "city" },
    { label: "Driver*", key: "driver", type: "driver" },
    {
      label: "Amount*",
      key: "amount",
      type: "number",
      additionalInfo:
        state.earning_summary &&
        `Available Amount - Rs.${state.earning_summary.available_amount}`,
    },
    {
      label: "Payment type*",
      key: "payment_type",
      type: "select",
      options: [
        { label: "Bank Transfer", value: "Bank Transfer" },
        { label: "Cash", value: "Cash" },
      ],
    },
    { label: "Payment ID*", key: "payment_id", type: "string" },
  ];
  useEffect(() => {
    if (isEditable) {
      GetPayout();
    }
  }, []);

  useEffect(() => {
    if (state?.form?.driver) {
      earningSummary(state?.form?.driver);
    }
  }, [state?.form?.driver]);

  const GetPayout = async () => {
    try {
      setState({ loading: false });
      const res: any = await Models.payout.getPayout({
        payout_id: params.id,
      });
      const data = {};
      if (res?.data) {
        Object.keys(initialValue).forEach((item) => {
          data[item] = res.data[item] || initialValue[item];
        });
        setState({ data });
      }
      setState({ loading: false });
    } catch (error) {
      console.log(error);
      toastifyError(error);
    }
  };

  const earningSummary = async (driver) => {
    try {
      const res: any = await Models.driver.earningSummary({
        driver: driver,
      });
      setState({ earning_summary: res.data });
    } catch (error) {
      console.log(error);
      toastifyError(error);
    }
  };

  const handleEdit = async (values) => {
    setState({ buttonDisabled: true });
    if (values.amount >= 0) {
      try {
        console.log("values", values);
        const data: any = removeEmptyValues(values);
        console.log("data", data);
        data.driver = data.driver._id;
        delete data.user;
        await Models.payout.editPayout({
          payout_id: params.id,
          ...data,
        });
        navigate("/payout");
      } catch (err) {
        setState({ buttonDisabled: false });
        console.log(err);
        toastifyError(err);
      }
    }
    // toastifyError("Payout amount it's should not less than 0"),
    else setState({ buttonDisabled: false });
  };

  const handleCreate = async (values) => {
    setState({ buttonDisabled: true });
    if (values.amount >= 0) {
      try {
        const data: any = removeEmptyValues(values);
        await Models.payout.createPayout(data);
        navigate("/payout");
      } catch (err) {
        setState({ buttonDisabled: false });
        console.log(err);
        toastifyError(err);
      }
    }
    // toastifyError("Payout amount it's should not less than 0"),
    else setState({ buttonDisabled: false });
  };

  return (
    <div className="add_payout_container">
      <div className="add_payout_wrapper">
        <History name={state?.data?.name} />
        <div className="add_payout_body_container">
          <Add
            title={`${isEditable ? "Edit" : "Add"} Payout`}
            actions={[{ link: "/", icon: "view" }]}
            data={state.data}
            values={inputFields}
            initialValues={initialValue}
            validationSchema="payout"
            onSubmit={isEditable ? handleEdit : handleCreate}
            // logo={<Logo />}
            buttons={<AddButton buttonDisabled={state.buttonDisabled} />}
            hasFiles
            getForm={(form) => setState({ form })}
          />
        </div>
      </div>
    </div>
  );

  function AddButton(props: any) {
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
