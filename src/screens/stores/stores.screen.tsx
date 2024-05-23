import React, { useEffect } from 'react';
import { useSetState, toastifyError } from 'utils/functions.utils';
import { Models } from 'utils/imports.utils';
import './stores.screen.scss';
import 'react-responsive-modal/styles.css';
import DeletePopup from 'components/delete_popup/delete_popup.component';
import Table from 'components/table/table.component';
import Button from 'common_components/ui/button/button.ui';
import Search from 'common_components/ui/search/search.ui';
import CustomModal from 'common_components/ui/modal/modal.component';
import { useNavigate } from 'react-router-dom';

export default function Stores() {
  const navigate = useNavigate();
  //redux

  //state
  const [state, setState] = useSetState({
    data: [],
    search: '',
    openModal: false,
    viewModal: false,
    deleteModal: false,
    loading: true,
  });

  const thead = [
    { head: 'Name', key: 'name' },
    { head: 'Address', key: 'address.address', isNested: true },
    { head: 'Type', key: 'type' },
    { head: 'Phone', key: 'phone' },
    // { head: 'Store incharge', key: 'store_incharge.username', isNested: true },
    { head: 'Organization', key: 'organization.name', isNested: true },
  ];
  // hooks
  useEffect(() => {
    GetManyData();
  }, [state.search]);

  //network req
  const GetManyData = async () => {
    try {
      const res: any = await Models.store.getManyStore({
        search: state.search,
      });
      setState({ data: res?.data?.docs, loading: false });
    } catch (error) {
      setState({ loading: false });
      console.log(error);
      toastifyError(error);
    }
  };

  const DeleteStores = async () => {
    try {
      await Models.store.deleteStore({
        store_id: state.id,
      });
      setState({ id: '', deleteModal: false });
      GetManyData();
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleView = (data) => {
    navigate(`/view_stores/${data?._id}`);
  };
  const handleEdit = (data) => {
    navigate(`/edit_stores/${data._id}`);
  };
  const handleDelete = (data) => {
    setState({ id: data._id, deleteModal: true });
  };

  return (
    <div className="stores_screen">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="head h5">Stores</div>
          <div className="search_wrapper">
            <Search
              value={state.search}
              onChange={(search) => setState({ search })}
            />
            <Button
              value="Add"
              onClick={() => {
                navigate('/add_stores');
              }}
            />
          </div>
        </div>
      </div>
      <div className="storestable">
        <Table
          data={state.data}
          loading={state.loading}
          theads={thead}
          link="stores"
          actions={[
            {
              icon: 'view',
              onClick: handleView,
            },
            {
              icon: 'edit',
              onClick: handleEdit,
            },
            {
              icon: 'delete',
              onClick: handleDelete,
            },
          ]}
          imageKey="logo"
        />
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
}
