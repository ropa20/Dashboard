import React, { useEffect } from 'react';
import History from 'components/history/history.component';
import Add from 'components/add/add.component';
import Button from 'common_components/ui/button/button.ui';
import './add_hub.screen.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { removeEmptyValues, useSetState, toastifyError } from 'utils/functions.utils';
import { Models } from 'utils/imports.utils';
import { IAddValues } from 'utils/interface.utils';

export default function AddHub() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pathArr = pathname.split('/');
  const isEditable = pathArr.includes('edit_hub');

  const initialValue = {
    name: '',
    city:'',
    address: '',
    total_chargers: '',
    available_chargers: '',
    total_vehicles: '',
    available_vehicles: '',
    hub_incharge: '',
    two_wheeler_count:'',
    three_wheeler_count:'',
  };

  const selectOption = [{ label: 'Test', value: 'test' }];

  const [state, setState] = useSetState({
    data: initialValue,
    loading: false,
    selectOptions: selectOption,
    buttonDisabled:false
  });

  const inputFields: IAddValues[] = [
    { label: "City*", key: "city", type: "city" },
    { label: "Name*", key: "name", type: "string" },
    { label: "Address*", key: "address", type: "address" },
    { label: "Total chargers", key: "total_chargers", type: "number" },
    { label: "Available chargers", key: "available_chargers", type: "number" },
    { label: "Total vehicles", key: "total_vehicles", type: "number" },
    { label: "2W vehicles", key: "two_wheeler_count", type: "number" },
    { label: "3W vehicles", key: "three_wheeler_count", type: "number" },
    { label: "Available vehicles", key: "available_vehicles", type: "number" },
  ];

  useEffect(() => {
    if (isEditable) {
      GetHub();
    }
  }, []);

  const GetHub = async () => {
    try {
      setState({ loading: false });
      const res: any = await Models.hub.getHub({
        hub_id: params.id,
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
      toastifyError(error);
      console.log(error);
    }
  };

  const handleEdit = async values => {
    setState({buttonDisabled:true})
    if (values.total_vehicles < values.available_vehicles) {
      setState({buttonDisabled:false})
      toastifyError("Available vechicles should be less than total vehicles");
    } else if (values.total_vehicles < values.two_wheeler_count) {
      setState({buttonDisabled:false})
      toastifyError("Two wheeler vehicles should be less than available vehicles");
    } else if (values.total_vehicles < values.two_wheeler_count) {
      setState({buttonDisabled:false})
      toastifyError("Three wheeler vehicles should be less than available vehicles");
    } else if (values.total_vehicles < values.two_wheeler_count + values.three_wheeler_count) {
      setState({buttonDisabled:false})
      toastifyError("Two / Three wheeler vehicles count should be less than available vehicles");
    } else if (values.total_vehicles !== values.two_wheeler_count + values.three_wheeler_count) {
      setState({buttonDisabled:false})
      toastifyError("Two / Three wheeler count mismatched to total vehicle count");
    } else {
      try {
        const data: any = removeEmptyValues(values);
        data.address = data.address._id || data.address;
        await Models.hub.editHub({
          hub_id: params.id,
          ...data,
        });
        navigate("/hub");
      } catch (err) {
        toastifyError(err);
        setState({buttonDisabled:false})
        console.log(err);
      }
    }
  };

  const handleCreate = async values => {
    setState({buttonDisabled:true})
    if (values.total_vehicles < values.available_vehicles) {
      setState({buttonDisabled:false})
      toastifyError("Available vechicles should be less than total vehicles");
    } else if (values.total_vehicles < values.two_wheeler_count) {
      setState({buttonDisabled:false})
      toastifyError("Two wheeler vehicles should be less than available vehicles");
    } else if (values.total_vehicles < values.two_wheeler_count) {
      setState({buttonDisabled:false})
      toastifyError("Three wheeler vehicles should be less than available vehicles");
    } else if (values.total_vehicles < values.two_wheeler_count + values.three_wheeler_count) {
      setState({buttonDisabled:false})
      toastifyError("Two / Three wheeler vehicles count should be less than available vehicles");
    } else if (values.total_vehicles !== values.two_wheeler_count + values.three_wheeler_count) {
      setState({buttonDisabled:false})
      toastifyError("Two / Three wheeler count mismatched to total vehicle count");
    } else {
      try {
        const data: any = removeEmptyValues(values);
        // console.log(data);
        if (state.logo) data.logo = state.logo;
        await Models.hub.createHub(data);
        navigate("/hub");
      } catch (err) {
        setState({buttonDisabled:false})
        toastifyError(err);
        console.log(err);
      }
    }
  };

  return (
    <div className="add_hub_container">
      <div className="add_hub_wrapper">
        <History name={state?.data?.name} />
        <div className="add_hub_body_container">
          <Add
            title={`${isEditable ? 'Edit' : 'Add'} Hub`}
            actions={[{ link: '/', icon: 'view' }]}
            data={state.data}
            values={inputFields}
            initialValues={initialValue}
            validationSchema="hub"
            onSubmit={isEditable ? handleEdit : handleCreate}
            buttons={<AddButton buttonDisabled={state.buttonDisabled}  />}
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
              <Button buttonDisabled={props.buttonDisabled} value="Save" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
