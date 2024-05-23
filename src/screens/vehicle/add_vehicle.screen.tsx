import React, { useEffect } from 'react';
import History from 'components/history/history.component';
import Add from 'components/add/add.component';
import Assets from 'imports/assets.import';
import Button from 'common_components/ui/button/button.ui';
import './add_vehicle.screen.scss';
import UploadButton from 'common_components/ui/upload_button/upload_button.ui';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { removeEmptyValues, useSetState, toastifyError } from 'utils/functions.utils';
import { Models } from 'utils/imports.utils';
import { IAddValues } from 'utils/interface.utils';

export default function AddVehicle() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pathArr = pathname.split('/');
  const isEditable = pathArr.includes('edit_vehicle');

  const initialValue = {
    model: '',
    number: '',
    city:'',
    type: '',
    bike_image: '',
    charge_percentage: '',
    total_kms: '',
    id: '',
    rc_book_image: '',
    insurance_image: '',
    hub:''
  };
  const selectOption = [{ label: 'Test', value: 'test' }];

  const [state, setState] = useSetState({
    data: initialValue,
    loading: false,
    selectOptions: selectOption,
    buttonDisabled:false
  });

  const inputFields: IAddValues[] = [
    { label: 'City*', key: 'city', type: 'city' },
    { label: 'Hub*', key: 'hub', type: 'hub' },
    { label: 'Model*', key: 'model', type: 'string' },
    { label: 'Number*', key: 'number', type: 'string' },
    { label: 'Type*', key: 'type', options: [{ label: "2W", value: '2W'},{ label: "3W", value: '3W'},{ label: "4W", value: '4W'}], type: 'select' },
    { label: 'Bike image', key: 'bike_image', type: 'file' },
    { label: 'Total kms', key: 'total_kms', type: 'number' },
    { label: 'Rc Book Front', key: 'rc_book_image', type: 'file' },
    { label: 'Rc Book Back', key: 'rc_book_image_back', type: 'file' },
    { label: 'Insurance image', key: 'insurance_image', type: 'file' },
  ];
  useEffect(() => {
    if (isEditable) {
      GetVehicle();
    }
  }, []);

  const GetVehicle = async () => {
    try {
      setState({ loading: false });
      const res: any = await Models.vehicle.getVehicle({
        vehicle_id: params.id,
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

  const handleEdit = async (values) => {
    setState({buttonDisabled:true})
    try {
      const data = removeEmptyValues(values);
      await Models.vehicle.editVehicle({
        vehicle_id: params.id,
        ...data,
      });
      navigate('/vehicle');
    } catch (err) {
      setState({buttonDisabled:false})
      console.log(err);
      toastifyError(err);
    }
  };

  const handleEditLogo = async (url) => {
    try {
      if (isEditable) {
        await Models.vehicle.editVehicle({
          vehicle_id: params.id,
          logo: url,
        });
        GetVehicle();
      } else {
        setState({ logo: url });
      }
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleCreate = async (values) => {
    setState({buttonDisabled:true})
    try {
      const data: any = removeEmptyValues(values);
      // console.log(data);
      if (state.logo) data.logo = state.logo;
      data.bike_image = [data.bike_image]
      await Models.vehicle.createVehicle(data);
      navigate('/vehicle');
    } catch (err) {
      setState({buttonDisabled:false})
      console.log(err);
      toastifyError(err);
    }
  };

  return (
    <div className="add_vehicle_container">
      <div className="add_vehicle_wrapper">
        <History name={state?.data?.name} />
        <div className="add_vehicle_body_container">
          <Add
            title={`${isEditable ? 'Edit' : 'Add'} Vehicle`}
            actions={[{ link: '/', icon: 'view' }]}
            data={state.data}
            values={inputFields}
            initialValues={initialValue}
            validationSchema="vehicle"
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
              <Button buttonDisabled={props.buttonDisabled} value="Save" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
