import React, { useEffect } from 'react';
import History from 'components/history/history.component';
import Add from 'components/add/add.component';
import Assets from 'imports/assets.import';
import Button from 'common_components/ui/button/button.ui';
import './add_store.screen.scss';
import UploadButton from 'common_components/ui/upload_button/upload_button.ui';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { removeEmptyValues, useSetState, toastifyError} from 'utils/functions.utils';
import { Models } from 'utils/imports.utils';
import { IAddValues } from 'utils/interface.utils';

export default function AddStore() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { organizationId, id } = useParams();
  const pathArr = pathname.split('/');
  const isEditable = pathArr.includes('edit_store');

  const initialValue = {
    name: '',
    address: '',
    type: '',
    phone: '',
    organization: '',
    city:''
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
    { label: "Type*", key: "type", type: "string" },
    { label: "Phone*", key: "phone", type: "string" },
  ];
  useEffect(() => {
    if (isEditable) {
      GetStore();
    }
    GetOrganization();
  }, []);

  const GetStore = async () => {
    try {
      setState({ loading: false });
      const res: any = await Models.store.getStore({
        store_id: id,
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

  const GetOrganization = async () => {
    try {
      const response: any = await Models.organization.getOrganization({
        organization_id: organizationId,
      });
      setState({ organization: response.data });
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleEdit = async (values) => {
    setState({buttonDisabled:true})
    try {
      const data: any = removeEmptyValues(values);
      data.organization = organizationId;
      data.address = data.address._id || data.address; 
      await Models.store.editStore({
        store_id: id,
        ...data,
      });
      navigate(`/organization/${organizationId}/store`);
    } catch (err) {
      setState({buttonDisabled:false})
      console.log(err);
      toastifyError(err);
    }
  };  

  const handleCreate = async (values) => {
    setState({buttonDisabled:true})
    try {
      const data: any = removeEmptyValues(values);
      data.organization = organizationId;
      await Models.store.createStore(data);
      navigate(`/organization/${organizationId}/store`);
    } catch (err) {
      setState({buttonDisabled:false})
      console.log(err);
    }
  };

  return (
    <div className="add_store_container">
      <div className="add_store_wrapper">
        <History
          name={state?.data?.name}
          path={
            isEditable
              ? `/organizaion/${state?.organization?.name}/${state?.data?.name}`
              : `/organizaion/${state?.organization?.name}/Add store`
          }
        />
        <div className="add_store_body_container">
          <Add
            title={`${isEditable ? 'Edit' : 'Add'} Store`}
            actions={[{ link: '/', icon: 'view' }]}
            data={state.data}
            values={inputFields}
            initialValues={initialValue}
            validationSchema="store"
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

  function CustomInputs() {
    return <div className="custom_inputs"></div>;
  }
}
