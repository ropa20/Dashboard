import React, { useEffect } from 'react';
import { useSetState } from 'utils/functions.utils';
import { Models } from 'utils/imports.utils';
import './_MNS_.screen.scss';
import 'react-responsive-modal/styles.css';
import DeletePopup from 'components/delete_popup/delete_popup.component';
import Table from 'components/table/table.component';
import Button from 'common_components/ui/button/button.ui';
import Search from 'common_components/ui/search/search.ui';
import CustomModal from 'common_components/ui/modal/modal.component';
import { useNavigate } from 'react-router-dom';

export default function _MN_() {
  const navigate = useNavigate();
  //redux

  //state
  const [state, setState] = useSetState({
    data: [],
    search: '',
    openModal: false,
    viewModal: false,
    deleteModal: false,
    loading: false,
  });

  _TH_;

  // hooks
  useEffect(() => {
    GetManyData();
  }, [state.search]);

  //network req
  const GetManyData = async () => {
    try {
      setState({ loading: false });
      const res: any = await Models._MNS_.getMany_MN_({
        search: state.search,
      });
      setState({ data: res?.data?.docs, loading: false });
    } catch (error) {
      console.log(error);
    }
  };

  const Delete_MN_ = async () => {
    try {
      await Models._MNS_.delete_MN_({
        _MNS__id: state.id,
      });
      setState({ id: '', deleteModal: false });
      GetManyData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleView = (data) => {
    navigate(`/view__MNS_/${data?._id}`);
  };
  const handleEdit = (data) => {
    navigate(`/edit__MNS_/${data._id}`);
  };
  const handleDelete = (data) => {
    setState({ id: data._id, deleteModal: true });
  };

  return (
    <div className="_MNS__screen">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="head h5">_MN_</div>
          <div className="search_wrapper">
            <Search
              value={state.search}
              onChange={(search) => setState({ search })}
            />
            <Button
              value="Add"
              onClick={() => {
                navigate('/add__MNS_');
              }}
            />
          </div>
        </div>
      </div>
      <div className="_MNS_table">
        <Table
          data={state.data}
          loading={state.loading}
          theads={thead}
          link="_MNS_"
          actions={[
            {
              icon: 'view',
              onClick: handleView
            },
            {
              icon: 'edit',
              onClick: handleEdit,
            },
            {
              icon: 'delete',
              onClick: handleDelete
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
          onPress={Delete_MN_}
          onCancel={() => setState({ deleteModal: false })}
        />
      </CustomModal>
    </div>
  );
}
