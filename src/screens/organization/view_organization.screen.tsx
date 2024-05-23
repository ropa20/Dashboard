import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./view_organization.screen.scss";
import History from "components/history/history.component";
import View from "components/view/view.component";
import Button from "common_components/ui/button/button.ui";
import Assets from "imports/assets.import";
import { Models } from "utils/imports.utils";
import { useSetState, toastifyError } from "utils/functions.utils";
import { IAddValues } from "utils/interface.utils";
import CustomModal from "common_components/ui/modal/modal.component";
import DeletePopup from "components/delete_popup/delete_popup.component";

export default function ViewOrganization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useSetState({
    data: {},
    deleteModal: false,
  });
  useEffect(() => {
    GetOrganization();
  }, []);

  const GetOrganization = async () => {
    try {
      // const response: any = await Models.organization.getOrganization({
      //   organization_id: id,
      // });
      setState({
        data: {
          name: "John Doe Enterprises",
          category: "Retail",
          gst: "27AAECJ1234H1Z3",
          contract_start_date: "2024-01-01",
          contract_end_date: "2025-01-01",
          minimum_guarentee: "10000",
          price_per_order: "50",
          price_over_order: "60",
          gst_doc: "path/to/gst_doc.pdf",
          agreement: "path/to/agreement.pdf",
          cancelled_cheque: "path/to/cancelled_cheque.pdf",
          pan_card: "path/to/pan_card.pdf",
          driver_price_per_order: "20",
          driver_minimum_guarentee: "5000",
          driver_price_over_order: "25",
          cancel_booking_permission: true,
        },
      });
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleDelete = async () => {
    try {
      await Models.organization.deleteOrganization({
        organization_id: id,
      });
      navigate("/organization");
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const inputFields: IAddValues[] = [
    { label: "Name", key: "name", type: "string" },
    { label: "Category", key: "category", type: "string" },
    { label: "Gst", key: "gst", type: "string" },
    { label: "Contract start sate", key: "contract_start_date", type: "date" },
    { label: "Contract end date", key: "contract_start_date", type: "date" },
    { label: "Minimum guarentee", key: "minimum_guarentee", type: "string" },
    { label: "Price per order", key: "price_per_order", type: "string" },
    { label: "Price over order", key: "price_over_order", type: "string" },
    { label: "Gst doc", key: "gst_doc", type: "file" },
    { label: "Agreement", key: "agreement", type: "file" },
    { label: "Cancelled cheque", key: "cancelled_cheque", type: "file" },
    { label: "Pan card", key: "pan_card", type: "file" },
    {
      label: "Driver price per order",
      key: "driver_price_per_order",
      type: "string",
    },
    {
      label: "Driver minimum guarentee",
      key: "driver_minimum_guarentee",
      type: "string",
    },
    {
      label: "Driver price over order",
      key: "driver_price_over_order",
      type: "string",
    },
    { label: "Cancel booking permission", key: "cancel_booking_permission", type: "checkbox" },
  ];

  return (
    <div className="view_organization_container">
      <div className="view_organization_wrapper">
        <History name={state.data.name} />
        <div className="view_organization_body_container">
          <View
            actions={[
              { link: `/organization/${id}/store`, icon: "store" },
              {
                link: `/edit_organization/${id}`,
                icon: "edit",
              },
              {
                link: "/",
                icon: "delete",
                onClick: () => setState({ deleteModal: true }),
              },
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
        <DeletePopup onPress={handleDelete} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>
    </div>
  );

  function ViewHeader() {
    return (
      <div className="view_head_left_container">
        <div className="view_head_image_conatiner">
          <img className="view_head_image" src={state?.data?.logo || Assets.testPic} alt="head_image" />
        </div>
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
