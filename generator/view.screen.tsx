import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './view__MNS_.screen.scss';
import History from 'components/history/history.component';
import View from 'components/view/view.component';
import Button from 'common_components/ui/button/button.ui';
import Assets from 'imports/assets.import';
import { Models } from 'utils/imports.utils';
import { useSetState } from 'utils/functions.utils';
import { IAddValues } from 'utils/interface.utils';
import DeletePopup from 'components/delete_popup/delete_popup.component';
import CustomModal from 'common_components/ui/modal/modal.component';
import { useNavigate } from 'react-router-dom';

export default function View_MN_() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useSetState({
    data: {},
    deleteModal: false,
  });
  useEffect(() => {
    Get_MN_();
  }, []);

  const Get_MN_ = async () => {
    try {
      const response: any = await Models._MNS_.get_MN_({
        _MNS__id: id,
      });
      setState({ data: response.data });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (data) => {
    setState({ id: data._id, deleteModal: true });
  };

  const Delete_MN_ = async () => {
    try {
      await Models._MNS_.delete_MN_({
        _MNS__id: id,
      });
      setState({ deleteModal: false });
      navigate('/_MNS_');
    } catch (err) {
      console.log(err);
    }
  };

  _INF_;

  return (
    <div className="view__MNS__container">
      <div className="view__MNS__wrapper">
        <History name={state.data.name} />
        <div className="view__MNS__body_container">
          <View
            actions={[
              { link: `/edit__MNS_/${id}`, icon: 'edit' },
              { icon: 'delete', onClick: handleDelete },
            ]}
            data={state.data}
            values={inputFields}
            head={<ViewHeader />}
            // buttons={<ViewButton />}
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
          onPress={Delete_MN_}
          onCancel={() => setState({ deleteModal: false })}
        />
      </CustomModal>
    </div>
  );

  function ViewHeader() {
    return (
      <div className="view_head_left_container">
        <div className="view_head_image_conatiner">
          <img
            className="view_head_image"
            src={state?.data?.logo || Assets.testPic}
            alt="head_image"
          />
        </div>
        <div className="view_head_title_container">
          <div className="view_head_title_wrapper">
            <div className="view_head_title">{state.data.name}</div>
            <div className="view_head_sub_title h5">{`${
              state?.data?.id || ''
            }`}</div>
          </div>
        </div>
      </div>
    );
  }

}
