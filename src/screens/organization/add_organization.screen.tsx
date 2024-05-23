import React, { useEffect } from "react";
import History from "components/history/history.component";
import Add from "components/add/add.component";
import Assets from "imports/assets.import";
import Button from "common_components/ui/button/button.ui";
import "./add_organization.screen.scss";
import UploadButton from "common_components/ui/upload_button/upload_button.ui";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { removeEmptyValues, useSetState, toastifyError } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import { IAddValues } from "utils/interface.utils";
import { ORG_TYPE } from "constants/org.constant";

export default function AddOrganization() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pathArr = pathname.split("/");
  const isEditable = pathArr.includes("edit_organization");

  const initialValue = {
    city: "",
    name: "",
    logo: "",
    gst: "",
    type: "",
    gst_doc: "",
    cancelled_cheque: "",
    pan_card: "",
    price_per_order: "",
    minimum_guarentee: "",
    price_over_order: "",
    category: "",
    agreement: "",
    driver_price_per_order: "",
    driver_minimum_guarentee: "",
    driver_price_over_order: "",
    cancel_booking_permission: "",
    contract_start_date: new Date(),
    contract_end_date: new Date(),
  };

  const selectOption = [
    { label: "Dinesh", value: "dinesh" },
    { label: "Dinesh mjs", value: "dmjs" },
    { label: "Mjs", value: "mjs" },
  ];

  const [state, setState] = useSetState({
    data: initialValue,
    loading: false,
    selectOptions: selectOption,
    buttonDisabled: false,
  });

  const inputFields: IAddValues[] = [
    { label: "City*", key: "city", type: "city" },
    { label: "Name*", key: "name", type: "string" },
    {
      label: "Type*",
      key: "type",
      options: [
        { label: "DEDICATED", value: "DEDICATED" },
        { label: "DYNAMIC", value: "DYNAMIC" },
      ],
      type: "select",
    },
    {
      label: "Category",
      key: "category",
      options: [
        { label: "Small", value: "Small" },
        { label: "Medium", value: "Medium" },
        { label: "Large", value: "Large" },
      ],
      type: "select",
    },
    { label: "Contract Start Date*", key: "contract_start_date", type: "date" },
    { label: "Contract End Date*", key: "contract_end_date", type: "date" },
    { label: "Gst*", key: "gst", type: "string" },
    { label: "Minimum guarantee", key: "minimum_guarentee", type: "number" },
    { label: "Price per order", key: "price_per_order", type: "number" },
    { label: "Price over order", key: "price_over_order", type: "number" },
    { label: "Pan card", key: "pan_card", type: "file" },
    { label: "Agreement", key: "agreement", type: "file" },
    { label: "Gst doc", key: "gst_doc", type: "file" },
    { label: "Cancelled cheque", key: "cancelled_cheque", type: "file" },
    {
      label: "Driver minimum guarantee",
      key: "driver_minimum_guarentee",
      type: "number",
    },

    {
      label: "Driver price per order",
      key: "driver_price_per_order",
      type: "number",
    },
    {
      label: "Driver price over order",
      key: "driver_price_over_order",
      type: "number",
    },
    { label: "Cancel booking permission", key: "cancel_booking_permission", type: "checkbox", isNested: true },
  ];

  useEffect(() => {
    if (isEditable) {
      GetOrganization();
    }
  }, []);

  const GetOrganization = async () => {
    try {
      setState({ loading: false });
      // const res: any = await Models.organization.getOrganization({
      //   organization_id: params.id,
      // });
      setState({
        data: {
          name: "John Doe Enterprises",
          category: "Small",
          type: "DEDICATED",
          gst: "27AAECJ1234H1Z3",
          contract_start_date: "2024-01-01",
          contract_end_date: "2025-01-01",
          minimum_guarentee: "10000",
          price_per_order: "50",
          price_over_order: "60",
          gst_doc: "path/to/gst_doc.pdf",
          agreement: "path/to/agreement.pdf",
          cancelled_cheque: "path/to/cancelled_cheque.pdf",
          pan_card: "path/to/pan_card.pdf",
          driver_price_per_order: "20",
          driver_minimum_guarentee: "5000",
          driver_price_over_order: "25",
          cancel_booking_permission: true,
        },
      });
      if (state?.data) {
        Object.keys(initialValue).forEach(item => {
          state.data[item] = state.data[item] || initialValue[item];
        });
        // setState({ data });
      }
      setState({ loading: false });
    } catch (error) {
      console.log(error);
      toastifyError(error);
    }
  };

  const handleEdit = async values => {
    setState({ buttonDisabled: true });
    try {
      const data = removeEmptyValues(values);
      let res = await Models.organization.editOrganization({
        organization_id: params.id,
        ...data,
      });
      navigate("/organization");
    } catch (err) {
      setState({ buttonDisabled: false });
      console.log(err);
      toastifyError(err);
    }
  };

  const handleEditLogo = async url => {
    try {
      if (isEditable) {
        await Models.organization.editOrganization({
          organization_id: params.id,
          logo: url,
        });
        GetOrganization();
      } else {
        setState({ logo: url });
      }
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleCreate = async values => {
    setState({ buttonDisabled: true });
    try {
      const data: any = removeEmptyValues(values);
      if (state.logo) data.logo = state.logo;
      await Models.organization.createOrganization(data);
      navigate("/organization");
    } catch (err) {
      setState({ buttonDisabled: false });
      console.log(err);
      toastifyError(err);
    }
  };

  return (
    <div className="add_organization_container">
      <div className="add_organization_wrapper">
        <History name={state?.data?.name} />
        <div className="add_organization_body_container">
          <Add
            title={`${isEditable ? "Edit" : "Add"} Organization`}
            actions={[
              { link: "/", icon: "view" },
              { link: "/", icon: "store" },
            ]}
            data={state.data}
            values={inputFields}
            initialValues={initialValue}
            validationSchema={isEditable ? "editOrganization" : "organization"}
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
              <img src={state?.data?.logo || state.logo || Assets.testPic} alt="add_logo" className="logo_image" />
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
