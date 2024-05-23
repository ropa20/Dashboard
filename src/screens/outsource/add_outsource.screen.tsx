import React, { useEffect } from "react";
import History from "components/history/history.component";
import Add from "components/add/add.component";
import Button from "common_components/ui/button/button.ui";
import "./add_outsource.screen.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { removeEmptyValues, useSetState, toastifyError } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import { IAddValues } from "utils/interface.utils";

export default function AddOutsource() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pathArr = pathname.split("/");
  const isEditable = pathArr.includes("edit_outsource");

  const initialValue = {
    organization: "",
    city:"",
    store: "",
    driver: "",
    start_time: "",
    end_time: "",
  };

  const selectOption = [{ label: "Test", value: "test" }];

  const [state, setState] = useSetState({
    data: initialValue,
    loading: false,
    selectOptions: selectOption,
    buttonDisabled:false
  });
  let inputFields : IAddValues[]=[];
  if (isEditable) {
    inputFields = [
      { label: "Start date*", key: "start_time", type: "date" },
      { label: "End date*", key: "end_time", type: "date" },
    ];
  } else {
    inputFields = [
      { label:"City*", key: "city", type: "city" },
      { label: isEditable ? "" : "Organization*", key: "organization", type: "dedicated_org" },
      { label: isEditable ? "Store" : "Store*", key: "store", type: "store" },
      { label: isEditable ? "Driver" : "Driver*", key: "driver", type: "driver" },
      { label: "Start date*", key: "start_time", type: "date" },
      { label: "End date*", key: "end_time", type: "date" },
    ];
  }
  useEffect(() => {
    if (isEditable) {
      GetOutsource();
    }
  }, []);

  const GetOutsource = async () => {
    try {
      setState({ loading: false });
      const res: any = await Models.outsource.getOutsource({
        outsource_id: params.id,
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
      console.log(error);
    }
  };

  const handleEdit = async values => {
    setState({buttonDisabled:true})
    try {
      const data: any = removeEmptyValues(values);
      data.organization = data.organization._id;
      data.driver = data.driver._id;
      data.store = data.store._id;
      await Models.outsource.editOutsource({
        outsource_id: params.id,
        ...data,
      });
      navigate("/outsource");
    } catch (err) {
      setState({buttonDisabled:false})
      console.log(err);
      toastifyError(err);
    }
  };

  const handleEditLogo = async url => {
    try {
      if (isEditable) {
        await Models.outsource.editOutsource({
          outsource_id: params.id,
          logo: url,
        });
        GetOutsource();
      } else {
        setState({ logo: url });
      }
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleCreate = async values => {
    setState({buttonDisabled:true})
    try {
      const data: any = removeEmptyValues(values);
      // console.log(data);
      if (state.logo) data.logo = state.logo;
      await Models.outsource.createOutsource(data);
      navigate("/outsource");
    } catch (err) {
      setState({buttonDisabled:false})
      console.log(err);
      toastifyError(err);
    }
  };

  return (
    <div className="add_outsource_container">
      <div className="add_outsource_wrapper">
        <History name={state?.data?.name} />
        <div className="add_outsource_body_container">
          <Add
            title={`${isEditable ? "Edit" : "Add"} Outsource`}
            actions={[{ link: "/", icon: "view" }]}
            data={state.data}
            values={inputFields}
            initialValues={initialValue}
            validationSchema="outsource"
            onSubmit={isEditable ? handleEdit : handleCreate}
            buttons={<AddButton buttonDisabled={state.buttonDisabled} />}
            hasFiles
            getForm={(form => setState({form}))}
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
              <Button buttonDisabled={props.buttonDisabled} value="Save" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
