import React, { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./view_booking.screen.scss";
import History from "components/history/history.component";
import View from "components/view/view.component";
import Button from "common_components/ui/button/button.ui";
import Assets from "imports/assets.import";
import { Models } from "utils/imports.utils";
import { timeConvert, timeConvertStatus, toastifyError, useSetState } from "utils/functions.utils";
import { IAddValues } from "utils/interface.utils";
import DeletePopup from "components/delete_popup/delete_popup.component";
import CustomModal from "common_components/ui/modal/modal.component";
import { useNavigate } from "react-router-dom";
import OrderTrack from "../../components/order_track/order_track.component";
import { BOOKING } from "constants/booking.constant";
import _ from "lodash";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer, Polyline } from "@react-google-maps/api";
import moment from "moment";

export default function ViewBooking() {
  let Map = useRef(null);
  let { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBG8SjQz30VnO_BrRL1YqQgx9dJ24NII1k",
    libraries: ["places"],
  });

  {
    /* @ts-ignore */
  }
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useSetState({
    data: {},
    deleteModal: false,
    driver_location: [],
    delivery_location: [],
    pickup_location: [],
    timeout: 0,
    directionsResponse: null,
    duration: null,
    distance: null,
    polyline_data: [],
    center: { lat: 13.059624, lng: 80.188048 },
    driverDetails: [],
    map_zoom: false,
  });
  useEffect(() => {
    GetBooking();
  }, []);

  useEffect(() => {
    calculateRoute();
  }, [state.calculateRoute]);

  useEffect(() => {
    let interval = setInterval(() => {
      setState({ timeout: Math.random() });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    GetBookingRefresh();
  }, [state.timeout]);

  const GetBookingRefresh = async () => {
    try {
      const response: any = await Models.booking.getBooking({
        id: id,
      });
      getMapLocation(response.data);
      setState({ data: response.data });
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  const GetBooking = async () => {
    try {
      const response: any = await Models.booking.getBooking({
        id: id,
      });
      getMapLocation(response.data);
      setState({ data: response.data });
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };
  const handleDelete = data => {
    setState({ id: data._id, deleteModal: true });
  };

  const DeleteBooking = async () => {
    try {
      await Models.booking.deleteBooking({
        id: id,
      });
      setState({ deleteModal: false });
      navigate("/booking");
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  const openCancelBookingPop = () => {
    setState({ cancelBooking: true });
  };

  const cancelBooking = async cancel_reason => {
    try {
      let body = {
        booking: id,
        driver: state.data?.driver?._id,
        status: BOOKING.CANCELLED,
        cancel_reason: cancel_reason,
      };
      await Models.status.createStatus(body);
      navigate("/booking");
    } catch (err) {
      console.log("cancelBooking err", err);
      toastifyError("Failed to cancel booking");
    }
  };

  const inputFields: IAddValues[] = [
    { label: "Store", key: "store.name", type: "string", isNested: true },
    { label: "Delivery address", key: "delivery_address.address", type: "string", isNested: true },
    { label: "Driver", key: "driver.name", type: "string", isNested: true },
    { label: "Booking id", key: "booking_id", type: "string" },
    { label: "Status", key: "status.status", type: "string", isNested: true },
  ];

  const getMapLocation = async data => {
    try {
      let driverLatLng, pickupLatLng, deliveryLatLng;
      if (data?.delivery_address) {
        deliveryLatLng = data.delivery_address.location.coordinates;
        setState({ delivery_location: deliveryLatLng });
      }
      if (data?.pickup_address) {
        pickupLatLng = data.pickup_address.location.coordinates;
        setState({ pickup_location: pickupLatLng });
      }

      if (!_.isEmpty(data.driver)) {
        let body = {
          driver: [data.driver._id],
        };
        const location: any = await Models.location.getCurrentLocation(body);
        if (location?.data?.length > 0) {
          driverLatLng = location?.data[0].loc.coordinates;
          setState({ driver_location: driverLatLng, driverDetails: location.data[0] });
        }
      }
      setState({ calculateRoute: Math.random() });
    } catch (err) {
      console.log("err", err);
    }
  };

  // getManyLocation for polyLine

  const getManyLocation = async () => {
    try {
      const body = {
        driver: state.data?.driver?._id,
        from_date: state.data?.pickup_time,
        to_date: state.data?.delivery_time,
      };
      const res: any = await Models.location.getManyLocation(body);
      setState({ polyline_data: res.data.docs });
      getPath()
    } catch (err: any) {
      console.log("err", err);
    }
  };

  // polyLine
  const getPath = () => {
    let pathArray: any = [];
    if (state.polyline_data?.length > 0) {
      state?.polyline_data?.map((markers: any) => {
        {
          /*@ts-ignore*/
        }
        pathArray.unshift({ lat: state.data?.pickup_address?.location?.coordinates[1], lng: state.data?.pickup_address?.location?.coordinates[0] });
        pathArray.push({ lat: markers.loc.coordinates[1], lng: markers.loc.coordinates[0] });
      });
      pathArray.push({ lat: state.data?.delivery_address?.location?.coordinates[1], lng: state.data?.delivery_address?.location?.coordinates[0] });
      return pathArray;
    } else {
      return pathArray;
    }
  };
  const getTimelineMarksers = timelineData => {
    let timelineArray:any = [];
    if (timelineData?.length > 0) {
      _.orderBy(timelineData, ["created_at"], ["asc"]);
      {
        /*@ts-ignore*/
      }
      timelineArray.push(timelineData[0]);
      {
        /*@ts-ignore*/
      }
      timelineArray.push(timelineData[timelineData.length - 1]);
      return timelineArray;
    } else {
      return timelineArray;
    }
  };
  const onHoverMarker = e => {
    let div = e.domEvent.target;
  };

  async function calculateRoute() {
    const directionsService = new google.maps.DirectionsService();
    let results;
    if (state.data.status_text === BOOKING.ACCEPTED) {
      results = await directionsService.route({
        origin: { lat: state.driver_location[1], lng: state.driver_location[0] },
        destination: { lat: state.pickup_location[1], lng: state.pickup_location[0] },
        travelMode: google.maps.TravelMode.DRIVING,
      });
    } else if (state.data.status_text === BOOKING.PLACED) {
      results = await directionsService.route({
        origin: { lat: state.pickup_location[1], lng: state.pickup_location[0] },
        destination: { lat: state.delivery_location[1], lng: state.delivery_location[0] },
        travelMode: google.maps.TravelMode.DRIVING,
      });
    } else if (state.data.status_text === BOOKING.PICKED_UP) {
      results = await directionsService.route({
        origin: { lat: state.driver_location[1], lng: state.driver_location[0] },
        destination: { lat: state.delivery_location[1], lng: state.delivery_location[0] },
        travelMode: google.maps.TravelMode.DRIVING,
      });
    } else if (state.data.status_text === BOOKING.DELIVERED) {
      getManyLocation();
      results = await directionsService.route({
        origin: { lat: state.pickup_location[1], lng: state.pickup_location[0] },
        destination: { lat: state.delivery_location[1], lng: state.delivery_location[0] },
        travelMode: google.maps.TravelMode.DRIVING,
      });
    } else {
      results = await directionsService.route({
        origin: { lat: state.pickup_location[1], lng: state.pickup_location[0] },
        destination: { lat: state.delivery_location[1], lng: state.delivery_location[0] },
        travelMode: google.maps.TravelMode.DRIVING,
      });
    }

    setState({ directionsResponse: results });
    {
      /*@ts-ignore*/
    }
    setState({ distance: results.routes[0].legs[0].distance.text });
    {
      /*@ts-ignore*/
    }
    setState({ duration: results.routes[0].legs[0].duration.text });
    console.log(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setState({
      directionsResponse: null,
      duration: null,
      distance: null,
    });
  }

  const getVehicleIcons = vehicleData => {
    if (vehicleData.vehicle) {
      if (vehicleData.vehicle.type === "2W") {
        return Assets.two_wheeler;
      } else if (vehicleData.vehicle.type === "3W") {
        return Assets.three_wheeler;
      } else if (vehicleData.vehicle.type === "4W") {
        return Assets.four_wheeler;
      } else {
        return Assets.two_wheeler;
      }
    } else {
      return Assets.two_wheeler;
    }
  };

  const getMarkerPosition = () => {
    if (state.driver_location.length > 0) {
      if (state.data.status_text === "PLACED" || state.data.status_text === "ACCEPTED" || state.data.status_text === "PICKED UP") {
        return { lat: state.driver_location[1], lng: state.driver_location[0] };
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const getTitle = () => {
    if (state?.data?.driver) {
      return `${state.data.driver.name ? state.data.driver.name : ""} ${state.data.driver.phone ? state.data.driver.phone : ""}  Lastupdated:${moment(
        state.data.created_at
      ).format("DD-MM-YYYY hh:mma")} Vehicle:${state.driverDetails?.vehicle ? state.driverDetails?.vehicle.number : "Ownvehicle"}`;
    } else {
      return "Driver";
    }
  };

  useEffect(() => {
    if (state.data) {
      getTime();
    }
  }, [state.data]);

  const getTime = () => {
    let startTime = moment(state?.data?.pickup_time);
    let endTime = moment(state?.data?.delivery_time);
    let duration: any = endTime.diff(startTime, "seconds");
    duration = timeConvertStatus(duration);
    return duration;
  };

  const getStatus = () => {
    if (true) {
      if (state.data.status_text === BOOKING.ACCEPTED) {
        return `Driver accepted the order will reach the pickup location in ${state.duration}. Pickup distance ${state.data.distance}`;
      } else if (state.data.status_text === BOOKING.PLACED) {
        return `Order has been placed waiting for driver to accept. Total distance ${state.distance}, Estimated time ${state.duration}`;
      } else if (state.data.status_text === BOOKING.PICKED_UP) {
        return `Driver picked up the order will reach the delivery location in ${state.duration}. Delivery distance ${state.distance}`;
      } else if (state.data.status_text === BOOKING.DELIVERED) {
        return `Order completed in ${getTime()}. Distance covered ${state.distance}`;
      } else {
        return `Distance : ${state.distance} -  Estimated time : ${state.duration}`;
      }
    }
  };
  
  const options = {
    strokeColor: "#F44336",
    strokeOpacity: 0.8,
    strokeWeight: 4,
    fillColor: "#F44336",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1,
  };
  const markerClick = (location: any) => {
    setState({ map_zoom: !state.map_zoom });
    setState({
      center: {
        lat: location.coordinates[1],
        lng: location.coordinates[0],
      },
    });
  };
  return (
    <>
      <div className="view_booking_container">
        <div className="view_bookings">
          <div className="view_booking_wrapper">
            <History name={state.data.name} />
          </div>
          <OrderTrack data={state.data} cancelBooking={openCancelBookingPop} />
          <CustomModal
            center
            open={state.cancelBooking}
            classNames={{ modalContainer: "delete_modal_container" }}
            onClose={() => setState({ cancelBooking: false })}
          >
            <DeletePopup
              cancel_booking={true}
              onPress={cancel_reason => cancelBooking(cancel_reason)}
              onCancel={() => setState({ cancelBooking: false })}
            />
          </CustomModal>
        </div>
      </div>
      <div className="tracking_status_text">{getStatus()}</div>
      <div className="map_container">
        {isLoaded && (
          <GoogleMap
            ref={Map}
            center={state.center}
            zoom={state.map_zoom ? 16 : 12}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              gestureHandling:"greedy",
              scrollwheel:false,
            }}
          >
            {getMarkerPosition() && state.data?.status_text !== BOOKING.DELIVERED && (
              <Marker
                icon={getVehicleIcons(state.driverDetails)}
                zIndex={1000000}
                title={getTitle()}
                /*@ts-ignore*/
                position={getMarkerPosition()}
              />
            )}
            {state.data?.pickup_address && state.data?.delivery_address && (
              <>
                <Marker
                  position={{ 
                    lat: state.data?.pickup_address?.location?.coordinates[1], 
                    lng: state.data?.pickup_address?.location?.coordinates[0] 
                  }}
                  icon={Assets.pickup_marker}
                  zIndex={1000000}
                  onMouseOver={e => onHoverMarker(e)}
                  onClick={() => markerClick(state.data?.pickup_address?.location)}
                  title={state.data?.pickup_address?.name}
                />
                <Marker
                  position={{
                    lat: state.data?.delivery_address?.location?.coordinates[1],
                    lng: state.data?.delivery_address?.location?.coordinates[0],
                  }}
                  icon={Assets.delivery_marker}
                  zIndex={1000000}
                  onMouseOver={e => onHoverMarker(e)}
                  onClick={() => markerClick(state.data?.delivery_address?.location)}
                  title={state.data?.delivery_address?.name}
                />
              </>
            )}
            {state.directionsResponse && state.data?.status_text !== BOOKING.DELIVERED && (
              <DirectionsRenderer directions={state.directionsResponse} />
            )}
            {state.data.status_text === BOOKING.DELIVERED && <Polyline path={getPath()} options={options} />}
          </GoogleMap>
        )}
      </div>
    </>
  );
}
