import React, { useEffect } from "react";
import History from "components/history/history.component";
import Add from "components/add/add.component";
import Assets from "imports/assets.import";
import Button from "common_components/ui/button/button.ui";
import "./add_user.screen.scss";
import UploadButton from "common_components/ui/upload_button/upload_button.ui";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { removeEmptyValues, useSetState, toastifyError, upperCase } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import { IAddValues } from "utils/interface.utils";
import { ROLES, UserPermission } from "constants/user.constant";
import CheckBox from "common_components/ui/check_box/check_box.ui";
import _ from "lodash";

const role = localStorage.getItem("role");
const org = localStorage.getItem("org");
const user_id = localStorage.getItem("user_id");

export default function AddUser() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pathArr = pathname.split("/");
  const isEditable = pathArr.includes("edit_user");

  const initialValue = {
    email: "",
    user_type: "",
    profile_picture: "",
    role: "",
    phone: "",
    username: "",
    store: "",
    organization: "",
    city: "",
  };

  const selectOption = [{ label: "Test", value: "test" }];
  const internal = [
    { label: "ADMIN", value: "ADMIN" },
    { label: "HUB INCHARGE", value: "HUB INCHARGE" },
  ];

  const external = [
    { label: "ORG ADMIN", value: "ORG ADMIN" },
    { label: "STORE ADMIN", value: "STORE ADMIN" },
  ];

  const [state, setState] = useSetState({
    data: initialValue,
    loading: false,
    selectOptions: selectOption,
    permission: [],
    roleBasedPermission: [],
    buttonDisabled: false,
  });

  const options = [
    { label: upperCase(ROLES.ORG_ADMIN), value: ROLES.ORG_ADMIN },
    { label: upperCase(ROLES.STORE_ADMIN), value: ROLES.STORE_ADMIN },
  ];

  if (role === ROLES.ADMIN) {
    options.unshift({ label: upperCase(ROLES.HUB_INCHARGE), value: ROLES.HUB_INCHARGE });
    options.unshift({ label: upperCase(ROLES.ADMIN), value: ROLES.ADMIN });
  }

  const inputFields: IAddValues[] = [
    { label: "City*", key: "city", type: "city" },
    {
      label: "Role*",
      key: "role",
      type: "select",
      options: options,
    },
    { label: "Email*", key: "email", type: "string" },
    {
      label: "Organization*",
      key: "organization",
      type: "organization",
      condition: form => role === ROLES.ADMIN && (form.role === ROLES.ORG_ADMIN || form.role === ROLES.STORE_ADMIN),
    },
    { label: "Store*", key: "store", type: "store", condition: form => form.role === ROLES.STORE_ADMIN },
    { label: "Phone*", key: "phone", type: "string" },
    { label: "Name*", key: "username", type: "string" },
    { label: isEditable ? "Password" : "Password*", key: "password", type: "string" },
  ];
  useEffect(() => {
    if (isEditable) {
      GetUser();
    }
  }, []);

  const GetUser = async () => {
    try {
      setState({ loading: false });
      // const res: any = await Models.user.getUser({
      //   id: params.id,
      // });

      setState({
        data: {
          username: "jdoe",
          email: "jdoe@example.com",
          city: {
            city_name: "New York",
          },
          organization: {
            name: "Tech Corp",
          },
          store: {
            name: "Tech Store",
          },
          role: "Manager",
          phone: "123-456-7890",
        },
      });
    } catch (error) {
      console.log(error);
      toastifyError(error);
    }
  };

  const handleEdit = async values => {
    setState({ buttonDisabled: true });
    try {
      const data = removeEmptyValues(values);
      data["user_permissions"] = state.permission;
      console.log("data", data);
      await Models.user.editUser({
        id: params.id,
        ...data,
      });
      navigate("/user");
    } catch (err) {
      setState({ buttonDisabled: false });
      toastifyError(err);
      console.log(err);
    }
  };

  const handleEditLogo = async url => {
    try {
      if (isEditable) {
        await Models.user.editUser({
          id: params.id,
          profile_picture: url,
        });
        GetUser();
      } else {
        setState({ profile_picture: url });
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
      data["user_permissions"] = state.permission;
      data.organization = org || data.organization;
      data.created_by = user_id;
      if (state.profile_picture) data.profile_picture = state.profile_picture;
      await Models.user.createUser(data);
      window.location.pathname = "/user";
    } catch (err) {
      setState({ buttonDisabled: false });
      console.log("err", err);
      toastifyError(err);
      console.log(err);
    }
  };

  const handleCheckbox = (value: any, index) => {
    let permission: any = state.permission;
    if (permission.includes(value)) {
      let indexNumber = permission.indexOf(value);
      permission.splice(indexNumber, 1);
      setState({ permission });
    } else {
      if (permission.includes("Profile")) {
        permission.push("Profile");
      }
      permission.push(value);
      setState({ permission });
    }
  };

  return (
    <div className="add_user_container">
      <div className="add_user_wrapper">
        <History name={state?.data?.username} />
        <div className="add_user_body_container">
          <Add
            title={`${isEditable ? "Edit" : "Add"} User`}
            actions={[{ link: "/", icon: "view" }]}
            data={state.data}
            values={inputFields}
            initialValues={initialValue}
            validationSchema={isEditable ? "userEdit" : "user"}
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
          <div className="logo_wrapper">
            <div className="logo_container">
              <img src={state?.data?.profile_picture || state.profile_picture || Assets.testPic} alt="add_logo" className="logo_image" />
            </div>
            <div className="button_container">
              <UploadButton onChange={handleEditLogo} buttonLabel="Upload new" name="File" accept="image/png,image/jpg" />
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

        <div className="checkbox_heading">User Permission</div>
        <div className="checkbox_container">
          {UserPermission.map((item: string, index: number) => {
            return (
              <div key={index} className="checkbox_wrapper">
                <div onClick={() => handleCheckbox(item, index)}>
                  <CheckBox checked={state.permission && state.permission.includes(item)} />
                </div>
                <div className="checkbox_name">{item}</div>
              </div>
            );
          })}
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
