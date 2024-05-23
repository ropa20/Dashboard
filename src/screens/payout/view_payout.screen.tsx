import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './view_payout.screen.scss';
import History from 'components/history/history.component';
import View from 'components/view/view.component';
import Button from 'common_components/ui/button/button.ui';
import Assets from 'imports/assets.import';
import { Models } from 'utils/imports.utils';
import { useSetState, toastifyError} from 'utils/functions.utils';
import { IAddValues } from 'utils/interface.utils';
import DeletePopup from 'components/delete_popup/delete_popup.component';
import CustomModal from 'common_components/ui/modal/modal.component';
import { useNavigate } from 'react-router-dom';

export default function ViewPayout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useSetState({
    data: {},
    deleteModal: false,
  });
  useEffect(() => {
    GetPayout();
  }, []);

  const GetPayout = async () => {
    try {
      const response: any = await Models.payout.getPayout({
        payout_id: id,
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

  const DeletePayout = async () => {
    try {
      await Models.payout.deletePayout({
        payout_id: id,
      });
      setState({ deleteModal: false });
      navigate('/payout');
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const inputFields: IAddValues[] = [
{label: "Driver", key: "driver.name", type: "string", isNested: true},
{label: "User", key: "user.username", type: "string", isNested: true},
{label: "Amount", key: "amount", type: "string"},
{label: "Payment type", key: "payment_type", type: "string"},
{label: "Payment ID", key: "payment_id", type: "string"},
]
;

  return (
    <div className="view_payout_container">
      <div className="view_payout_wrapper">
        <History name={state.data.name} />
        <div className="view_payout_body_container">
          <View
            actions={[
              { link: `/edit_payout/${id}`, icon: 'edit' },
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
          onPress={DeletePayout}
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
