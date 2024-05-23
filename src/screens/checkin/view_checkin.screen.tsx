import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './view_checkin.screen.scss';
import History from 'components/history/history.component';
import View from 'components/view/view.component';
import Button from 'common_components/ui/button/button.ui';
import Assets from 'imports/assets.import';
import { Models } from 'utils/imports.utils';
import { useSetState, toastifyError } from 'utils/functions.utils';
import { IAddValues } from 'utils/interface.utils';
import DeletePopup from 'components/delete_popup/delete_popup.component';
import CustomModal from 'common_components/ui/modal/modal.component';
import { useNavigate } from 'react-router-dom';

export default function ViewCheckin() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useSetState({
    data: {},
    deleteModal: false,
  });
  useEffect(() => {
    GetCheckin();
  }, []);

  const GetCheckin = async () => {
    try {
      const response: any = await Models.checkin.getCheckin({
        checkin_id: id,
      });
      setState({ data: response.data });
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  const handleDelete = (data) => {
    setState({ id: data._id, deleteModal: true });
  };

  const DeleteCheckin = async () => {
    try {
      await Models.checkin.deleteCheckin({
        checkin_id: id,
      });
      setState({ deleteModal: false });
      navigate('/checkin');
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  const inputFields: IAddValues[] = [
{label: "Driver", key: "driver.name", type: "string", isNested: true},
{label: "Date", key: "date", type: "date"},
{label: "Store", key: "store.name", type: "string", isNested: true},
{label: "Store checkin time", key: "store_checkin_time", type: "date"},
{label: "Store checkout time", key: "store_checkout_time", type: "date"},
{label: "Vehicle checkin time", key: "vehicle_checkin_time", type: "date"},
{label: "Vehicle", key: "vehicle.number", type: "string", isNested: true},
// {label: "Vehicle checkout time", key: "vehicle_checkout_time", type: "string"},
{label: "Vehicle pickup images", key: "vehicle_pickup_images", type: "files"},
// {label: "Vehicle drop images", key: "vehicle_drop_images", type: "files"},
];

  return (
    <div className="view_checkin_container">
      <div className="view_checkin_wrapper">
        <History name={state.data.name} />
        <div className="view_checkin_body_container">
          <View
            actions={[]}
            data={state.data}
            values={inputFields}
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
          onPress={DeleteCheckin}
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
