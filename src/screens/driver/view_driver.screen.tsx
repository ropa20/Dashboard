import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./view_driver.screen.scss";
import History from "components/history/history.component";
import View from "components/view/view.component";
import Button from "common_components/ui/button/button.ui";
import Assets from "imports/assets.import";
import { Models } from "utils/imports.utils";
import { useSetState, toastifyError } from "utils/functions.utils";
import { IAddValues } from "utils/interface.utils";
import DeletePopup from "components/delete_popup/delete_popup.component";
import CustomModal from "common_components/ui/modal/modal.component";
import { useNavigate } from "react-router-dom";

export default function ViewDriver() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useSetState({
    data: {},
    deleteModal: false,
  });
  useEffect(() => {
    GetDriver();
  }, []);

  const GetDriver = async () => {
    try {
      const response: any = await Models.driver.getDriver({
        driver_id: id,
      });
      setState({ data: response.data });
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  const handleDelete = data => {
    setState({ id: data._id, deleteModal: true });
  };

  const DeleteDriver = async () => {
    try {
      await Models.driver.deleteDriver({
        driver_id: id,
      });
      setState({ deleteModal: false });
      navigate("/driver");
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  const inputFields: IAddValues[] = [
    { label: "Phone", key: "phone", type: "string" },
    { label: "Name", key: "name", type: "string" },
    { label: "Email", key: "email", type: "string" },
    { label: "Emergency contact", key: "emergency_contact", type: "string" },
    { label: "Onboarded by", key: "onboarded_by.username", isNested:true, type: "string" },
    { label: "Remarks", key: "remarks",type: "string" },
    { label: "", key: "title", type: "title" },

    { label: "", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "Bank Details", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "Customer name", key: "bank_details.customer_name", type: "string", isNested: true },
    { label: "Account number", key: "bank_details.account_number", type: "string", isNested: true },
    { label: "IFSC code", key: "bank_details.ifsc_code", type: "string", isNested: true },

    { label: "Primary Address", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "Address", key: "primary_address.address", type: "string", isNested: true },
    { label: "City", key: "city.city_name", type: "string", isNested: true },
    { label: "Pincode", key: "primary_address.pincode", type: "string", isNested: true },

    { label: "Secondary Address(Optional)", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "Address", key: "secondary_address.address", type: "string", isNested: true },
    { label: "City", key: "secondary_address.city", type: "string", isNested: true },
    { label: "Pincode", key: "secondary_address.pincode", type: "string", isNested: true },

    { label: "Earning Summary", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "", key: "title", type: "title" },
    { label: "Total Earnings", key: "earning_summary.total_earning", type: "string", isNested: true },
    { label: "Total Withdrawal", key: "earning_summary.total_withdrawal", type: "string", isNested: true },
    { label: "Available Balance", key: "earning_summary.available_amount", type: "string", isNested: true },
    { label: "Requested Date", key: "requested_at", type: "date" },
    { label: "Approved Date", key: "approved_at", type: "date" },
    { label: "Rejected Date", key: "rejected_at", type: "date" },

    { label: "Vehicle insurance", key: "vehicle_insurance", type: "file" },
    { label: "Passport size_photo", key: "passport_size_photo", type: "file" },
    { label: "Bank Passbook / Cheque ", key: "bank_details.passbook", type: "file", isNested:true },
    { label: "Aadhaar card_front", key: "aadhaar_card_front", type: "file" },
    { label: "Aadhaar card_back", key: "aadhaar_card_back", type: "file" },
    { label: "Driving licence_front", key: "driving_licence_front", type: "file" },
    { label: "Driving licence_back", key: "driving_licence_back", type: "file" },
    { label: "Pan card", key: "pan_card", type: "file" },
    { label: "Rc book_front", key: "vehicle_info.rc_book", type: "file", isNested:true },
    { label: "Rc book_back", key: "vehicle_info.rc_book_back", type: "file", isNested:true },
  ];

  return (
    <div className="view_driver_container">
      <div className="view_driver_wrapper">
        <History name={state.data.name} />
        <div className="view_driver_body_container">
          <View
            actions={[
              { link: `/payout?driver=${id}`, icon: "payout" },
              { link: `/checkin?driver=${id}`, icon: "vehicle" },
              { link: `/edit_driver/${id}`, icon: "edit" },
              { icon: "delete", onClick: handleDelete },
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
        classNames={{ modalContainer: "delete_modal_container" }}
        onClose={() => setState({ deleteModal: false })}
      >
        <DeletePopup onPress={DeleteDriver} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>
    </div>
  );

  function ViewHeader() {
    return (
      <div className="view_head_left_container">
        <div className="view_head_image_conatiner">
          <img className="view_head_image" src={state?.data?.passport_size_photo || Assets.testPic} alt="head_image" />
        </div>
        <div className="view_head_title_container">
          <div className="view_head_title_wrapper">
            <div className="view_head_title">{state.data.name}</div>
          </div>
        </div>
      </div>
    );
  }
}
