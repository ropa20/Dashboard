import Button from "common_components/ui/button/button.ui";
import { BOOKING } from "constants/booking.constant";
import Assets from "imports/assets.import";
import Colors from "imports/color.import";
import moment from "moment";
import React from "react";
import "./order_track.component.scss";

interface orderTrackProps {
  data: any;
  cancelBooking: () => void;
}
export default function OrderTrack(props: orderTrackProps) {
  const { data, cancelBooking } = props;
  return (
    <div className="order_track_container">
      <div className="driver_info_container">
        <div className="driver_info_wrapper">
          <div className="driver_image_container">
            <img src={Assets.testPic} alt="" className="driver_image" />
          </div>
          <div className="driver_wrapper">
            <div className="driver_label caption2">Driver</div>
            <div className="driver_name h6">{data?.driver?.name}</div>
            <div className="driver_id caption2">Driver ID {data?.driver?.id}</div>
            <div className="driver_id caption2">Phone {data?.driver?.phone}</div>
          </div>
        </div>
        <div className="driver_header_right">
          {!data.organization?.cancel_booking_permission && (
            <div className="cancel_booking_wrapper">
              {(data?.status?.status === BOOKING.PLACED ||
                data?.status?.status === BOOKING.PICKED_UP ||
                data?.status?.status === BOOKING.ACCEPTED) && <Button value="Cancel Booking" color="red" onClick={cancelBooking} />}
            </div>
          )}
          <div className="order_info_container">
            <div className="order_label">Order ID</div>
            <div className="order_id_container">ID: {data?.order_id}</div>
          </div>
        </div>
      </div>
      <div className="tracker_wrapper">
        <div className="tracker_status_wrapper">
          <div className="tracker_info_conatiner">
            <div className="tracker_info_wrapper">
              <div className="circle_container">
                <div className="outer_circle">
                  <div className="inner_circle" />
                </div>
                <div className="status_line">
                  <img src={Assets.line} className={`status_line_image ${data?.pickup_time && "primary_line"}`} />
                </div>
              </div>
              <div className="tracker_status_item_wrapper">
                <div className="time_container caption2">{moment(data?.created_at).format("hh:mm a")}</div>
                <div className="name_container h6">
                  {/* {data?.store?.address?.address} */}
                  {data.status_text}
                </div>
                <div className="address_container caption2"></div>
              </div>
            </div>

            <div className="tracker_info_wrapper">
              <div className={`status_icon_container ${(data?.pickup_time || data?.delivery_time) && "primary"}`}>
                <img src={Assets.pickup} alt="" className="status_icon" />
                <div className="status_line">
                  <img src={Assets.line} className={`status_line_image2 ${data?.delivery_time && "primary_line"}`} />
                </div>
              </div>
              <div className="tracker_status_item_wrapper">
                <div className="time_container caption2">{data?.pickup_time && moment(data?.pickup_time).format("hh:mm a")}</div>
                <div className="name_container h6">{data?.pickup_address?.name}</div>
                <div className="address_container caption2">{data?.pickup_address?.address}</div>
              </div>
            </div>
            <div className="tracker_info_wrapper">
              <div className={`status_icon_container ${data?.delivery_time && "primary"}`}>
                <img src={Assets.location} alt="" className="status_icon" />
              </div>
              <div className="tracker_status_item_wrapper">
                <div className="time_container caption2">
                  {data?.delivery_time ? moment(data?.delivery_time).format("hh:mm a") : `Exp. ${moment().add(20, "minute").format("hh:mm a")}`}
                </div>
                <div className="name_container h6">{data?.delivery_address?.name}</div>
                <div className="address_container caption2">{data?.delivery_address?.address}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
