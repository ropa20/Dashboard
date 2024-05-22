import React, { useEffect } from 'react';
import History from 'components/history/history.component';
import Add from 'components/add/add.component';
import Assets from 'imports/assets.import';
import Button from 'common_components/ui/button/button.ui';
import './add__MNS_.screen.scss';
import UploadButton from 'common_components/ui/upload_button/upload_button.ui';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { removeEmptyValues, useSetState } from 'utils/functions.utils';
import { Models } from 'utils/imports.utils';
import { IAddValues } from 'utils/interface.utils';

export default function Add_MN_() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pathArr = pathname.split('/');
  const isEditable = pathArr.includes('edit__MNS_');

  _IV_;

  const selectOption = [{ label: 'Test', value: 'test' }];

  const [state, setState] = useSetState({
    data: initialValue,
    loading: false,
    selectOptions: selectOption,
  });

  _INF_;

  useEffect(() => {
    if (isEditable) {
      Get_MN_();
    }
  }, []);

  const Get_MN_ = async () => {
    try {
      setState({ loading: false });
      const res: any = await Models._MNS_.get_MN_({
        _MNS__id: params.id,
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
    }
  };

  const handleEdit = async (values) => {
    try {
      const data = removeEmptyValues(values);
      await Models._MNS_.edit_MN_({
        _MNS__id: params.id,
        ...data,
      });
      navigate('/_MNS_');
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditLogo = async (url) => {
    try {
      if (isEditable) {
        await Models._MNS_.edit_MN_({
          _MNS__id: params.id,
          logo: url,
        });
        Get_MN_();
      } else {
        setState({ logo: url });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = async (values) => {
    try {
      const data: any = removeEmptyValues(values);
      // console.log(data);
      if (state.logo) data.logo = state.logo;
      await Models._MNS_.create_MN_(data);
      navigate('/_MNS_');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add__MNS__container">
      <div className="add__MNS__wrapper">
        <History name={state?.data?.name} />
        <div className="add__MNS__body_container">
          <Add
            title={`${isEditable ? 'Edit' : 'Add'} _MN_`}
            actions={[{ link: '/', icon: 'view' }]}
            data={state.data}
            values={inputFields}
            initialValues={initialValue}
            validationSchema="_MNS_"
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
