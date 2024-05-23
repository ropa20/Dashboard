import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './view_stores.screen.scss';
import History from 'components/history/history.component';
import View from 'components/view/view.component';
import Button from 'common_components/ui/button/button.ui';
import { Models } from 'utils/imports.utils';
import { useSetState, toastifyError } from 'utils/functions.utils';
import { IAddValues } from 'utils/interface.utils';
import DeletePopup from 'components/delete_popup/delete_popup.component';
import CustomModal from 'common_components/ui/modal/modal.component';
import { useNavigate } from 'react-router-dom';

export default function ViewStores() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useSetState({
    data: {},
    deleteModal: false,
  });
  useEffect(() => {
    GetStores();
  }, []);

  const GetStores = async () => {
    try {
      const response: any = await Models.store.getStore({
        store_id: id,
      });
      setState({ data: response.data });
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleDelete = (data) => {
    setState({ id: data._id, deleteModal: true });
  };

  const DeleteStores = async () => {
    try {
      await Models.store.deleteStore({
        store_id: id,
      });
      setState({ deleteModal: false });
      navigate('/stores');
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const inputFields: IAddValues[] = [
    { label: 'Name', key: 'name', type: 'string' },
    {
      label: 'Address',
      key: 'address.address',
      type: 'string',
      isNested: true,
    },
    { label: 'Type', key: 'type', type: 'string' },
    { label: 'Phone', key: 'phone', type: 'string' },
    {
      label: 'Store incharge',
      key: 'store_incharge.username',
      type: 'string',
      isNested: true,
    },
    {
      label: 'Organization',
      key: 'organization.name',
      type: 'string',
      isNested: true,
    },
  ];
  return (
    <div className="view_stores_container">
      <div className="view_stores_wrapper">
        <History name={state.data.name} />
        <div className="view_stores_body_container">
          <View
            actions={[
              { link: `/edit_stores/${id}`, icon: 'edit' },
              { icon: 'delete', onClick: handleDelete },
            ]}
            data={state.data}
            values={inputFields}
            head={<ViewHeader />}
            hasFiles
          />
        </div>
      </div>
      <CustomModal
        center
        open={state.deleteModal}
        classNames={{ modalContainer: 'delete_modal_container' }}
        onClose={() => setState({ deleteModal: false })}>
        <DeletePopup
          onPress={DeleteStores}
          onCancel={() => setState({ deleteModal: false })}
        />
      </CustomModal>
    </div>
  );

  function ViewHeader() {
    return (
      <div className="view_head_left_container">
        <div className="view_head_title_container">
          <div className="view_head_title_wrapper">
            <div className="view_head_title">{state?.data?.name}</div>
            <div className="view_head_sub_title h5">{`${
              state?.data?.id || ''
            }`}</div>
          </div>
        </div>
      </div>
    );
  }
}
