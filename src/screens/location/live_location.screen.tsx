import React, { useEffect, useRef } from "react";
import "./live_location.screen.scss";
import { useNavigate } from "react-router-dom";
import Functions, { ErrorMessage, useSetState } from "utils/functions.utils";
import moment from "moment";
import DatePicker from "react-datepicker";
import { Field, Formik } from "formik";
import { Assets, Models } from "utils/imports.utils";
import Select from "components/select/select.component";
import CheckBox from "common_components/ui/check_box/check_box.ui";
import checked from "assets/icons/checked.svg";
import _ from "lodash";
import Autocomplete from "react-google-autocomplete";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoBox,
  InfoWindow,
  MarkerClusterer,
  // Autocomplete,
  Polyline,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { DRIVER_STATUS } from "constants/driver.constant";
import toast, { Toaster } from "react-hot-toast";
import { autoRefreshTime } from "utils/constant.utils";
import Switch from "react-switch";

let maptype;
export default function LiveLocation() {
  const store = localStorage.getItem("store");
  const org = localStorage.getItem("org");
  let city: any = localStorage.getItem("city");
  city = JSON.parse(city);

  const Map: any = useRef(/** @type google.maps.Map */ null);
  let { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBG8SjQz30VnO_BrRL1YqQgx9dJ24NII1k",
    libraries: ["places"],
  });

  // google map
  // const directionsService = new google.maps.DirectionsService();
  // const directionsRenderer = new google.maps.DirectionsRenderer();

  const [state, setState] = useSetState({
    search: "",
    loading: true,
    center: {
      lat: 13.0827,
      lng: 80.2707,
    },
    zoom: 12,
    currentLocationData: [],
    timelineData: [],
    currentLocation: true,
    timeline: false,
    driver: "",
    date: new Date(),
    availableDriver: 0,
    timeout: 0,
    focus: false,
    driver_list_show: false,
    search_driver: "",
    limit: 500,
    driver_list: [],
    checkin_driver: [],
    show_driver_name: false,
    driver_name: "",
    driver_loading: false,
    close: true,
    infoBoxData: "",
    cluster: false,
    directionsResponse: null,
    map: /** @type google.maps.Map */ null,
    infoWindowOpen: false,
    prefix: "",
    polylineMarker: [],
    followOn: false,
  });

  // useEffect(() => {
  //   // getManyLocation();
  //   getManyDriver();
  //   maptype = "currentlocation";
  // }, []);

  // useEffect(() => {
  //   if (state.currentLocation) {
  //     getManyLocation();
  //   }
  // }, [state.currentLocation]);

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     setState({ timeout: Math.random() });
  //   }, autoRefreshTime);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   // getManyDriver()
  //   if (state.timeline) {
  //     getManyLocationByDate(state.date, state.driver, true);
  //   } else {
  //     getManyLocation(true);
  //   }
  // }, [state.timeout]);

  const getManyLocationByDate = async (date, driver = state.driver, refresh = false) => {
    try {
      setState({ date: date });
      if (driver) {
        let body = {
          from_date: moment(date).startOf("day").toDate(),
          to_date: moment(date).endOf("day").toDate(),
          driver: driver,
          limit: 10000,
        };
        if (!refresh) {
          toast.loading("Getting Location details...", {
            id: "1",
          });
        }
        let res: any = await Models.location.getManyLocation(body);
        if (maptype === "timeline") {
          setState({ timelineData: res?.data?.docs });
          setState({ polylineMarker: res.data.docs });
        }
        if (res?.data?.docs.length > 0) {
          let timelineData = res.data.docs;
          if (!refresh && maptype === "timeline") {
            setState({
              center: {
                lat: timelineData[timelineData.length - 1].loc.coordinates[1],
                lng: timelineData[timelineData.length - 1].loc.coordinates[0],
              },
            });
          }
        }
        getManyDriver();
        setTimeout(() => {
          setState({ timeout: Math.random() });
        }, 5000);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const getManyLocation = async (refresh = false) => {
    try {
      const body: any = {
        limit: 10000,
        skip: 0,
        date: state.date,
      };
      let array: any = [];
      if (!refresh) {
        toast.loading("Getting Location details...", {
          id: "1",
        });
      }
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (store) {
        let body = {
          limit: 100,
          org: org,
          store: store,
        };
        const getStoreDrivers: any = await Models.driver.getStoreDrivers(body);
        getStoreDrivers.data.docs.map(drivers => {
          array.push(drivers._id);
        });
      } else {
        const getCheckin: any = await Models.checkin.getManyCheckin(body);
        const filterData = getCheckin.data.docs.filter((elem: any) => !elem.store_checkout_time);
        filterData?.map((data: any) => {
          array.push(data.driver._id);
        });
      }

      setState({ availableDriver: array?.length });
      if (state.driver === "" && state.currentLocation) {
        // setState({ show_driver_name: false });
        let driver = {
          driver: array,
        };
        if (!_.isEmpty(city)) {
          driver["city"] = city.value;
        }
        const location: any = await Models.location.getCurrentLocation(driver);

        if (maptype === "currentlocation") {
          setState({ currentLocationData: location.data });
        }

        if (location.data.length > 0 && !refresh && maptype === "currentlocation") {
          gotoLocation(location.data[0]);
        }
      } else {
        let driver = {
          driver: [state.driver],
        };
        const location: any = await Models.location.getCurrentLocation(driver);

        if (maptype === "currentlocation") {
          setState({ currentLocationData: location.data });
          console.log("current location", state.currentLocation);
        }

        if (location.data.length > 0 && !refresh && maptype === "currentlocation") {
          gotoLocation(location.data[0]);
        }
      }
      getManyDriver();
      setTimeout(() => {
        setState({ timeout: Math.random() });
      }, 5000);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getCurrentLocation = async driverId => {
    try {
      toast.loading("Get drivers Location", {
        id: "1",
      });

      let driver = {
        driver: [driverId],
      };

      if (!_.isEmpty(city)) {
        driver["city"] = city.value;
      }
      const location: any = await Models.location.getCurrentLocation(driver);
      if (location.data.length > 0 && state.currentLocation) {
        setState({
          currentLocationData: location.data,
        });
        gotoLocation(location.data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const searchDriver = (value, search?) => {
    setState({ driver: value, search, data: [], currentLocationData: [], timelineData: [] });
    if (state.timeline) {
      getManyLocationByDate(state.date, value);
    } else {
      getCurrentLocation(value);
    }
  };

  const gotoLocation = value => {
    try {
      let center = {
        lat: value?.loc?.coordinates[1],
        lng: value?.loc?.coordinates[0],
      };
      {
        /*@ts-ignore*/
      }
      // Map.current.panTo(center)
      // Map.current.setZoom(16)

      setState({
        center: center,
        zoom: state.zoom === 20 ? 12 : Math.min(20, state.zoom + 4),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const center = { lat: 50.064192, lng: -130.605469 };

  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  };

  const onHoverMarker = (e, data: any) => {
    let div = e;
    setState({ infoBoxData: data });
    // setState({infoBoxData:JSON.parse(e.domEvent.target.parentElement.ariaLabel)})
    // console.log('maps',JSON.parse(e.domEvent.target.parentElement.ariaLabel));
    setState({ close: false });
  };

  const getPath = () => {
    let pathArray = [];
    if (state.timelineData?.length > 0) {
      state?.timelineData?.map((markers: any) => {
        {
          /*@ts-ignore*/
        }
        // pathArray.push({ lat: markers.loc.coordinates[1], lng: markers.loc.coordinates[0] });
      });
      return pathArray;
    } else {
      return pathArray;
    }
  };

  const getTimelineMarksers: any = timelineData => {
    let timelineArray = [];
    if (timelineData?.length > 0) {
      _.orderBy(timelineData, ["created_at"], ["asc"]);
      {
        /*@ts-ignore*/
      }
      // timelineArray.push(timelineData[0]);
      {
        /*@ts-ignore*/
      }
      // timelineArray.push(timelineData[timelineData.length - 1]);
      return timelineArray;
    } else {
      return timelineArray;
    }
  };

  const getVehicleIcons = vehicleData => {
    if (vehicleData.driver.own_vehicle) {
      return Assets.own_vehicle;
    } else {
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
    }
  };

  const changeLocationState = () => {
    if (state.currentLocation) {
      maptype = "timeline";
      setState({
        currentLocation: false,
        show_driver_name: false,
        timeline: true,
        driver: "",
        date: new Date(),
        search: "",
        currentLocationData: [],
        timelineData: [],
      });
    } else {
      maptype = "currentlocation";
      setState({
        timeline: false,
        currentLocation: true,
        show_driver_name: false,
        driver: "",
        date: new Date(),
        search: "",
        timelineData: [],
        currentLocationData: [],
      });
    }
  };

  const getTitle = markers => {
    return `${markers.driver.name ? markers.driver.name : ""} ${markers.driver.phone ? markers.driver.phone : ""}  Lastupdated:${moment(
      markers.created_at
    ).format("DD-MM-YYYY hh:mma")} Vehicle:${markers?.vehicle?.number ? markers.vehicle.number : "Ownvehicle"}`;
  };

  // getManyDriver
  const getManyDriver = async () => {
    setState({ driver_loading: true });
    let drivers_data: any;
    await getChekinDriver();
    try {
      const body: any = {
        limit: state.limit,
        search: state.search_driver,
        filter: DRIVER_STATUS.APPROVED,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (store) {
        let data = {
          limit: 100,
          org: org,
          search: state.search_driver,
          store: store,
        };
        const getStoreDrivers: any = await Models.driver.getStoreDrivers(data);
        drivers_data = getStoreDrivers.data.docs;
      } else {
        const res: any = await Models.driver.getManyDriver(body);
        drivers_data = res.data.docs;
      }
      let checkStatus = drivers_data.map((item: any) => ({
        ...item,
        active_status: getStatus(item._id),
      }));
      let sortDriver = _.orderBy(checkStatus, ["active_status", "name"], ["asc", "asc"]);
      setState({ driver_list: sortDriver });
      setState({ driver_loading: false });
    } catch (err: any) {
      setState({ driver_loading: false });
      console.log("err", err);
    }
  };

  // useEffect(() => {
  //   getManyDriver();
  // }, [state.search_driver]);

  // getCheckinDriver
  let checkin_driver: any;
  const getChekinDriver = async () => {
    try {
      let body = {};
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      const res: any = await Models.checkin.getChekinDriver(body);
      checkin_driver = res.data;
    } catch (err: any) {
      console.log("err");
    }
  };

  // check active and inActive status
  const getStatus = (id: string) => {
    let status = "In-active";
    const checkStatus = checkin_driver.some(user => user.driver._id === id);
    if (checkStatus) {
      status = "Active";
      return status;
    } else {
      return status;
    }
  };

  // polyline icon
  const lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 2,
    strokeColor: "#F44336",
  };

  const options = {
    strokeColor: "#734F96",
    strokeWeight: 4,
    fillColor: "#F44336",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1,
    icons: [
      {
        icon: lineSymbol,
        offset: "0",
        repeat: "50px",
      },
    ],
  };
  const clusterOptions: any = {
    imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m", // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
    styles: [
      {
        textColor: "white",
        url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
        height: 53,
        width: 53,
        textSize: 18,
      },
      {
        textColor: "white",
        url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png",
        height: 56,
        width: 56,
        textSize: 18,
      },
      {
        textColor: "white",
        url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png",
        height: 66,
        width: 66,
        textSize: 18,
      },
    ],
  };

  const onLoad = infoBox => {};

  const locationDetailsShow = (data: any) => {
    getPrefix();
    setState({ infoBoxData: data, infoWindowOpen: true });
  };

  const handleClose = (data: any) => {
    setState({ InfoBoxData: "", infoWindowOpen: false });
    // setState({ map_zoom: !state.map_zoom, close: true});
  };

  const getPrefix = () => {
    const prefix = moment().toDate().getTime();
    setState({ prefix });
  };

  const handleFollowOn = (checked: any) => {
    setState({ followOn: checked });
  };

  // useEffect(() => {
  //   if (state.followOn) {
  //     const driverLocation = _.orderBy(state.timelineData, ["created_at"], ["asc"]);
  //     if (!_.isEmpty(driverLocation)) {
  //       const data = driverLocation[driverLocation?.length - 1];
  //       setState({ center: { lat: data.loc.coordinates[1], lng: data.loc.coordinates[0] } });
  //     }
  //   }
  // }, [state.followOn, state.timelineData]);

  return (
    <div className="container">
      <div className="location_screen">
        <div className="location_wrapper">
          <div className="location_container">
            <div className="button_container">
              <div className="current_location" onClick={() => changeLocationState()}>
                <div>
                  <CheckBox checked={state.currentLocation} />
                </div>
                <div className="text">Current location</div>
              </div>
              <div className="timeline" onClick={() => changeLocationState()}>
                <div>
                  <CheckBox checked={state.timeline} />
                </div>
                <div className="text">Timeline</div>
              </div>
            </div>
            <div className="add_field_container">
              <div
                className={
                  state.focus ? "live_location_screen_driver_list_input live_location_screen_input_focus" : "live_location_screen_driver_list_input"
                }
              >
                <input
                  value={state.show_driver_name ? state.driver_name : state.search_driver}
                  onChange={e => setState({ search_driver: e.target.value })}
                  placeholder="Drivers"
                  onBlur={() => setState({ focus: false })}
                  onClick={() => setState({ focus: !state.focus, driver_list_show: !state.driver_list_show, show_driver_name: false })}
                />
              </div>
              {/* <Formik onSubmit={() => console.log("Submit")} initialValues={{ search: state.search }} enableReinitialize>
                <Field name={"driver"}>
                  {({ field, form }) => <Select name={"driver"} onChange={searchDriver} type={store ? "store_driver" : "driver"} placeholder="Driver" value={state.search} />}
                </Field>
              </Formik> */}
            </div>
            <div className="available_driver_container">
              <div className="available_driver_text">{state.availableDriver}</div>
            </div>
          </div>
          {state.timeline && state.driver !== "" && (
            <div className="date_wrapper">
              <div className="date_container">
                <DatePicker
                  selected={state.date}
                  dateFormat="MMMM d, yyyy"
                  className="calender"
                  onChange={date => getManyLocationByDate(date)}
                  placeholderText="Select a date other than today or yesterday"
                />
              </div>
            </div>
          )}

          {(!state.timeline || state.driver == "") && (
            <div className="auto_complete">
              {isLoaded && (
                <Autocomplete
                  apiKey={"AIzaSyBG8SjQz30VnO_BrRL1YqQgx9dJ24NII1k"}
                  style={{
                    border: `1px solid transparent`,
                    width: `250px`,
                    height: `40px`,
                    padding: `0 6px`,
                    borderRadius: `4px`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                    zIndex: 2,
                    marginLeft: 10,
                  }}
                  placeholder={"Search a location..."}
                  onPlaceSelected={(place: any) => {
                    let center = {
                      lat: place?.geometry?.location?.lat(),
                      lng: place?.geometry?.location?.lng(),
                    };
                    setState({ center: center, zoom: 20 });
                  }}
                  options={{
                    bounds: defaultBounds,
                    componentRestrictions: { country: "in" },
                    fields: ["address_components", "geometry", "icon", "name"],
                    strictBounds: false,
                    types: ["establishment"],
                  }}
                />
              )}
            </div>
          )}

          {!_.isEmpty(state.driver) && state.timeline && (
            <div className="auto_recenter_wrapper">
              <div className="auto_recenter_heading">Re-centre</div>
              <div>
                <Switch
                  className="auto_recenter_switch"
                  borderRadius={16}
                  offColor={"#E9E9EA"}
                  onColor={"#ffffff"}
                  height={26}
                  width={40}
                  checkedIcon={false}
                  uncheckedIcon={false}
                  onChange={handleFollowOn}
                  checked={state.followOn}
                  offHandleColor={"#ffffff"}
                  onHandleColor={"#659446"}
                />
              </div>
            </div>
          )}
        </div>
        <div className="map_wrapper">
          {state.driver_list_show ? (
            <div className={"live_location_screen_driver_list_details"}>
              {state.driver_list.length > 0 ? (
                state.driver_list.map((item: any) => {
                  return (
                    <div
                      onClick={() => {
                        searchDriver(item._id),
                          setState({ driver_list_show: false, driver: item._id, driver_name: item.name, show_driver_name: true });
                      }}
                      className="live_location_screen_driver_list_flex_warpper"
                    >
                      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <div>
                          <img width={35} height={35} src={Assets.profile} />
                        </div>
                        <div>{item.name}</div>
                      </div>
                      <div className="live_location_screen_driver_status">{item?.active_status}</div>
                    </div>
                  );
                })
              ) : (
                <>
                  {state.driver_loading ? (
                    <div className="driver_not_found">Loading...</div>
                  ) : (
                    <div className="driver_not_found">Drivers not found</div>
                  )}
                </>
              )}
            </div>
          ) : null}
          {isLoaded && (
            <GoogleMap
              ref={Map}
              onClick={() => setState({ driver_list_show: false })}
              center={state.center}
              zoom={state.map_zoom ? 14 : 14}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={map => setState({ map: map })}
            >
              {state?.currentLocationData?.length > 0 && (
                <MarkerClusterer maxZoom={19} options={clusterOptions}>
                  {clusterer =>
                    state?.currentLocationData?.map((markers: any) => (
                      <Marker
                        animation={google.maps.Animation.DROP}
                        aria-label="Balaji"
                        clusterer={clusterer}
                        onClick={() => {
                          setState({ map_zoom: !state.map_zoom });
                          locationDetailsShow(markers);
                        }}
                        icon={getVehicleIcons(markers)}
                        position={{ lat: markers.loc.coordinates[1], lng: markers.loc.coordinates[0] }}
                      >
                        {state.infoBoxData && state.infoBoxData?.driver._id === markers?.driver._id && state.infoWindowOpen && (
                          <InfoWindow
                            key={`${markers._id}-${state.prefix}`}
                            onCloseClick={() => handleClose(markers)}
                            onLoad={onLoad}
                            options={options}
                            position={state.center}
                          >
                            <div className="info_window_location_details">
                              <div className="infobox_flex_wrapper">
                                <div className="infobox_driver_name">{state.infoBoxData?.driver?.name}</div>
                                <div className="infobox_driver_name">{state.infoBoxData?.driver?.phone}</div>
                              </div>
                              <div style={{ marginTop: "5px" }} className="infobox_flex_wrapper">
                                <div className="infobox_driver_name">Lastupdated:</div>
                                <div className="infobox_driver_name">{moment(state.infoBoxData?.created_at).format("DD-MM-YYYY hh:mma")}</div>
                              </div>
                              <div style={{ marginTop: "5px" }} className="infobox_flex_wrapper">
                                <div className="infobox_driver_name">Vehicle:</div>
                                <div className="infobox_driver_name">
                                  {state.infoBoxData?.vehicle?.number ? state.infoBoxData.vehicle.number : "Ownvehicle"}
                                </div>
                              </div>
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    ))
                  }
                </MarkerClusterer>
              )}
              {state?.timelineData?.length > 0 && (
                <MarkerClusterer maxZoom={19} onMouseOut={() => setState({ close: true })} zoomOnClick={true} options={clusterOptions}>
                  {clusterer =>
                    getTimelineMarksers(state.timelineData).map((markers: any, index: number) => (
                      <Marker
                        animation={google.maps.Animation.DROP}
                        aria-label="Balaji"
                        clusterer={clusterer}
                        onClick={() => {
                          setState({ map_zoom: !state.map_zoom });
                          locationDetailsShow(markers);
                        }}
                        icon={index == 0 ? Assets.start : getVehicleIcons(markers)}
                        position={{ lat: markers.loc.coordinates[1], lng: markers.loc.coordinates[0] }}
                      >
                        {state.infoBoxData && state.infoBoxData?._id === markers?._id && state.infoWindowOpen && (
                          <InfoWindow
                            key={`${markers._id}-${state.prefix}`}
                            onCloseClick={() => handleClose(markers)}
                            onLoad={onLoad}
                            options={options}
                            position={state.center}
                          >
                            <div className="info_window_location_details">
                              <div className="infobox_flex_wrapper">
                                <div className="infobox_driver_name">{state.infoBoxData?.driver?.name}</div>
                                <div className="infobox_driver_name">{state.infoBoxData?.driver?.phone}</div>
                              </div>
                              <div style={{ marginTop: "5px" }} className="infobox_flex_wrapper">
                                <div className="infobox_driver_name">Lastupdated:</div>
                                <div className="infobox_driver_name">{moment(state.infoBoxData?.created_at).format("DD-MM-YYYY hh:mma")}</div>
                              </div>
                              <div style={{ marginTop: "5px" }} className="infobox_flex_wrapper">
                                <div className="infobox_driver_name">Vehicle:</div>
                                <div className="infobox_driver_name">
                                  {state.infoBoxData?.vehicle?.number ? state.infoBoxData.vehicle.number : "Ownvehicle"}
                                </div>
                              </div>
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    ))
                  }
                </MarkerClusterer>
              )}
              <Polyline path={getPath()} options={options} />
            </GoogleMap>
          )}
        </div>
      </div>
    </div>
  );
}
