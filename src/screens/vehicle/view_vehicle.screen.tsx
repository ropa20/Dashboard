import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './view_vehicle.screen.scss';
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
import _ from 'lodash';

export default function ViewVehicle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useSetState({
    data: {},
    deleteModal: false,
  });
  useEffect(() => {
    GetVehicle();
  }, []);

  const GetVehicle = async () => {
    try {
      const response: any = await Models.vehicle.getVehicle({
        vehicle_id: id,
      });
      let data = response.data;
      if (data.hasOwnProperty("bike_image")) {
        if (data.bike_image[0] === null || _.isEmpty(data.bike_image)) {
          data.bike_image = "";
        } else {
          data.bike_image = data.bike_image[0];
        }
      }
      setState({ data });
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleDelete = (data) => {
    setState({ id: data._id, deleteModal: true });
  };

  const DeleteVehicle = async () => {
    try {
      await Models.vehicle.deleteVehicle({
        vehicle_id: id,
      });
      setState({ deleteModal: false });
      navigate('/vehicle');
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const inputFields: IAddValues[] = [
    { label: "ID", key: "_id", type: "string" },
    { label: "Model", key: "model", type: "string" },
    { label: "City", key: "city.city_name", type: "string" ,isNested:true },
    { label: "Number", key: "number", type: "string" },
    { label: "Type", key: "type", type: "string" },
    { label: "Bike image", key: "bike_image", type: "file" },
    { label: "Charge percentage", key: "charge_percentage", type: "string" },
    { label: "Total kms", key: "total_kms", type: "string" },
    { label: "Rc book front", key: "rc_book_image", type: "file" },
    { label: "Rc book back", key: "rc_book_image_back", type: "file" },
    { label: "Insurance image", key: "insurance_image", type: "file" },
    { label: "Vehicle Status", key: "vehicle_status", type: "string" },
  ];

  return (
    <div className="view_vehicle_container">
      <div className="view_vehicle_wrapper">
        <History name={state.data.name} path={"/vehicle/view_vehicle"}/>
        <div className="view_vehicle_body_container">
          <View
            actions={[
              { link: `/edit_vehicle/${id}`, icon: 'edit' },
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
          onPress={DeleteVehicle}
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
          </div>
        </div>
      </div>
    );
  }

  
}
