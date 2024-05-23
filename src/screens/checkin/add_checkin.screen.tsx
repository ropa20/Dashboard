import React, { useEffect } from 'react';
import History from 'components/history/history.component';
import Add from 'components/add/add.component';
import Assets from 'imports/assets.import';
import Button from 'common_components/ui/button/button.ui';
import './add_checkin.screen.scss';
import UploadButton from 'common_components/ui/upload_button/upload_button.ui';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { removeEmptyValues, useSetState, toastifyError } from 'utils/functions.utils';
import { Models } from 'utils/imports.utils';
import { IAddValues } from 'utils/interface.utils';

export default function AddCheckin() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pathArr = pathname.split('/');
  const isEditable = pathArr.includes('edit_checkin');

  const initialValue = {
    driver: '',
    vehicle: '',
    store: '',
    date: '',
    store_checkin_time: '',
    vehicle_checkin_time: '',
    vehicle_pickup_images: '',
    vehicle_drop_images: '',
    store_checkout_time: '',
    vehicle_checkout_time: '',
  }
    ;

  const selectOption = [{ label: 'Test', value: 'test' }];

  const [state, setState] = useSetState({
    data: initialValue,
    loading: false,
    selectOptions: selectOption,
  });

  const inputFields: IAddValues[] = [
    { label: "Driver", key: "driver", type: "driver" },
    { label: "Vehicle", key: "vehicle", type: "vehicle" },
    { label: "Store", key: "store", type: "store" },
    { label: "Store checkin time", key: "store_checkin_time", type: "date" },
    { label: "Vehicle checkin time", key: "vehicle_checkin_time", type: "date" },
    { label: "Vehicle pickup images", key: "vehicle_pickup_images", type: "string" },
    { label: "Vehicle drop images", key: "vehicle_drop_images", type: "string" },
    { label: "Store checkout time", key: "store_checkout_time", type: "date" },
    { label: "Vehicle checkout time", key: "vehicle_checkout_time", type: "date" },
  ]
    ;

  useEffect(() => {
    if (isEditable) {
      GetCheckin();
    }
  }, []);

  const GetCheckin = async () => {
    try {
      setState({ loading: false });
      const res: any = await Models.checkin.getCheckin({
        checkin_id: params.id,
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

  const handleEdit = async (values) => {
    try {
      const data = removeEmptyValues(values);
      await Models.checkin.editCheckin({
        checkin_id: params.id,
        ...data,
      });
      navigate('/checkin');
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  const handleEditLogo = async (url) => {
    try {
      if (isEditable) {
        await Models.checkin.editCheckin({
          checkin_id: params.id,
          logo: url,
        });
        GetCheckin();
      } else {
        setState({ logo: url });
      }
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  const handleCreate = async (values) => {
    try {
      const data: any = removeEmptyValues(values);
      // console.log(data);
      if (state.logo) data.logo = state.logo;
      await Models.checkin.createCheckin(data);
      navigate('/checkin');
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  return (
    <div className="add_checkin_container">
      <div className="add_checkin_wrapper">
        <History name={state?.data?.name} />
        <div className="add_checkin_body_container">
          <Add
            title={`${isEditable ? 'Edit' : 'Add'} Checkin`}
            actions={[{ link: '/', icon: 'view' }]}
            data={state.data}
            values={inputFields}
            initialValues={initialValue}
            validationSchema="checkin"
            onSubmit={isEditable ? handleEdit : handleCreate}
            logo={<Logo />}
            buttons={<AddButton />}
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
              <img
                src={state?.data?.logo || state.logo || Assets.testPic}
                alt="add_logo"
                className="logo_image"
              />
            </div>
            <div className="button_container">
              <UploadButton
                onChange={handleEditLogo}
                buttonLabel="Upload new"
                name="File"
              />
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

  function AddButton() {
    return (
      <div className="view_button_container">
        <div className="view_button_wrapper">
          {isEditable ? (
            <div className="view_button">
              <Button value="Update" />
            </div>
          ) : (
            <div className="view_button">
              <Button value="Save" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
