import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './view_hub.screen.scss';
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

export default function ViewHub() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useSetState({
    data: {},
    deleteModal: false,
  });
  useEffect(() => {
    GetHub();
  }, []);

  const GetHub = async () => {
    try {
      const response: any = await Models.hub.getHub({
        hub_id: id,
      });
      setState({ data: response.data });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (data) => {
    setState({ id: data._id, deleteModal: true });
  };

  const DeleteHub = async () => {
    try {
      await Models.hub.deleteHub({
        hub_id: id,
      });
      setState({ deleteModal: false });
      navigate('/hub');
    } catch (err) {
      console.log(err);
    }
  };

  const inputFields: IAddValues[] = [
    { label: "Name", key: "name", type: "string" },
    { label: "Address", key: "address.address", type: "string", isNested: true },
    { label: "Total chargers", key: "total_chargers", type: "string" },
    { label: "Available chargers", key: "available_chargers", type: "string" },
    { label: "Total vehicles", key: "total_vehicles", type: "string" },
    { label: "Available vehicles", key: "available_vehicles", type: "string" },
    { label: "Hub incharge", key: "hub_incharge.email", type: "string", isNested: true },
  ]
    ;

  return (
    <div className="view_hub_container">
      <div className="view_hub_wrapper">
        <History name={state.data.name} />
        <div className="view_hub_body_container">
          <View
            actions={[
              { link: `/edit_hub/${id}`, icon: 'edit' },
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
          onPress={DeleteHub}
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
            <div className="view_head_sub_title h5">{`${state?.data?.id || ''
              }`}</div>
          </div>
        </div>
      </div>
    );
  }
}
