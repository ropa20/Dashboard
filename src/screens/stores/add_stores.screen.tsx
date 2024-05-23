import React, { useEffect } from 'react';
import History from 'components/history/history.component';
import Add from 'components/add/add.component';
import Button from 'common_components/ui/button/button.ui';
import './add_stores.screen.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { removeEmptyValues, useSetState, toastifyError} from 'utils/functions.utils';
import { Models } from 'utils/imports.utils';
import { IAddValues } from 'utils/interface.utils';

export default function AddStores() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const pathArr = pathname.split('/');
  const isEditable = pathArr.includes('edit_stores');

  const initialValue = {
    name: '',
    address: '',
    type: '',
    phone: '',
    store_incharge: '',
    organization: '',
  };
  const selectOption = [{ label: 'Test', value: 'test' }];

  const [state, setState] = useSetState({
    data: initialValue,
    loading: false,
    selectOptions: selectOption,
  });

  const inputFields: IAddValues[] = [
    { label: 'Name', key: 'name', type: 'string' },
    { label: 'Address', key: 'address', type: 'address' },
    { label: 'Type', key: 'type', type: 'string' },
    { label: 'Phone', key: 'phone', type: 'string' },
    { label: 'Store incharge', key: 'store_incharge', type: 'user' },
    { label: 'Organization', key: 'organization', type: 'organization' },
  ];
  useEffect(() => {
    if (isEditable) {
      GetStores();
    }
  }, []);

  const GetStores = async () => {
    try {
      setState({ loading: false });
      const res: any = await Models.store.getStore({
        store_id: params.id,
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
    try {
      const data = removeEmptyValues(values);
      await Models.store.editStore({
        store_id: params.id,
        ...data,
      });
      navigate('/stores');
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleCreate = async (values) => {
    try {
      const data: any = removeEmptyValues(values);
      if (state.logo) data.logo = state.logo;
      await Models.store.createStore(data);
      navigate('/stores');
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  return (
    <div className="add_stores_container">
      <div className="add_stores_wrapper">
        <History name={state?.data?.name} />
        <div className="add_stores_body_container">
          <Add
            title={`${isEditable ? 'Edit' : 'Add'} Stores`}
            actions={[{ link: '/', icon: 'view' }]}
            data={state.data}
            values={inputFields}
            initialValues={initialValue}
            validationSchema="stores"
            onSubmit={isEditable ? handleEdit : handleCreate}
            buttons={<AddButton />}
            hasFiles
          />
        </div>
      </div>
    </div>
  );

  function AddButton() {
    return (
      <div className="view_button_container">
        <div className="view_button_wrapper">
          {isEditable ? (
            <div className="view_button">
              <Button value="Save" />
            </div>
          ) : (
            <div className="view_button">
              <Button value="Add Store" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
