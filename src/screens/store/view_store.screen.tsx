import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './view_store.screen.scss';
import History from 'components/history/history.component';
import View from 'components/view/view.component';
import Button from 'common_components/ui/button/button.ui';
import Assets from 'imports/assets.import';
import { Models } from 'utils/imports.utils';
import { useSetState, toastifyError } from 'utils/functions.utils';
import { IAddValues } from 'utils/interface.utils';
import CustomModal from 'common_components/ui/modal/modal.component';
import DeletePopup from 'components/delete_popup/delete_popup.component';

export default function ViewStore() {
  const navigate = useNavigate();
  const { id, organizationId } = useParams();
  const [state, setState] = useSetState({
    data: {},
    organization: {},
  });
  console.log(state);
  useEffect(() => {
    GetStore();
    GetOrganization();
  }, []);

  const GetStore = async () => {
    try {
      const response: any = await Models.store.getStore({
        store_id: id,
      });
      console.log(response.data);
      setState({ data: response.data });
    } catch (err) {
      console.log(err);
      toastifyError(err);
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

  const DeleteStore = async () => {
    try {
      await Models.store.deleteStore({
        store_id: state.data._id,
      });
      setState({ id: '', deleteModal: false });
      navigate(`/organization/${organizationId}/store`);
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
    // {label: "Store incharge", key: "store_incharge.", type: "string", isNested: true},
    {
      label: 'Organization',
      key: 'organization.name',
      type: 'string',
      isNested: true,
    },
  ];

  const handleDelete = () => {
    setState({ deleteModal: true });
  };

  return (
    <div className="view_store_container">
      <div className="view_store_wrapper">
        <History
          name={state.data.name}
          path={`/organizaion/${state?.organization?.name}/${state?.data?.name}`}
        />
        <div className="view_store_body_container">
          <View
            actions={[
              {
                link: `/organization/${organizationId}/edit_store/${state.data._id}`,
                icon: 'edit',
              },
              { link: '/', icon: 'delete', onClick: handleDelete },
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
          onPress={DeleteStore}
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
            <div className="view_head_title">{state.data.name}</div>
            {/* <div className="view_head_sub_title h5">{`Enterprise - ${
              state?.data?.id || ''
            }`}</div> */}
          </div>
        </div>
      </div>
    );
  }

  
}
