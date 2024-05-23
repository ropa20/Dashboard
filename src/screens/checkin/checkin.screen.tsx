import React, { useEffect } from "react";
import Functions, { useSetState, useQuery, toastifyError, checkinApiCall } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import "./checkin.screen.scss";
import "react-responsive-modal/styles.css";
import DeletePopup from "components/delete_popup/delete_popup.component";
import Table from "components/table/table.component";
import CustomModal from "common_components/ui/modal/modal.component";
import { useNavigate } from "react-router-dom";
import { Field, Formik } from "formik";
import Select from "components/select/select.component";
import Assets from "imports/assets.import";
import { autoRefreshTime } from "utils/constant.utils";
import _ from "lodash";
import DateRangePicker from "common_components/ui/date_range_picker/date_range.component";
import SelectDropdown from "common_components/ui/select_dropdown/select_dropdown.component";
import { CheckinFilter, CheckinStatus } from "constants/user.constant";
import moment from "moment";
import Button from "common_components/ui/button/button.ui";
import { CSVLink } from "react-csv";
import { DRIVER_STATUS } from "constants/driver.constant";

export default function Checkin() {
  const navigate = useNavigate();
  const query = useQuery();
  let city: any = localStorage.getItem("city");
  city = JSON.parse(city);

  // ref
  const exportCheckinDataRef: any = React.useRef<{ link: HTMLAnchorElement }>(null);

  //redux

  //state
  const [state, setState] = useSetState({
    data: [],
    search: "",
    openModal: false,
    viewModal: false,
    deleteModal: false,
    loading: true,
    limit: 20,
    tiomeout: 0,
    refreshLimit: 20,
    checkin_driver_count: 0,
    break_in_driver_count: 0,
    dateRange: ["", ""],
    filterStatus: "",
    filterDriver: "",
    filterCity: "",
    filterStore: "",
    filterVehicle: "",
    vehicleData: [],
    cityData: [],
    cityStore: "",
    driverData: [],
    storeData: [],
    exportCheckinData: "",
  });

  const thead = [
    { head: "Status", key: "status", type: "statuscheck" },
    { head: "Driver", key: "driver.name", isNested: true },
    { head: "City", key: "driver.city.city_name", isNested: true },
    { head: "Break in", key: "break_time_in", type: "date" },
    { head: "Break out", key: "break_time", type: "date" },
    { head: "Store", key: "store.name", isNested: true },
    { head: "Store checkin time", type: "datetime", key: "store_checkin_time" },
    { head: "Store checkout time", type: "datetime", key: "store_checkout_time" },
    { head: "Total break time", type: "min", key: "totalBreak" },
    { head: "Total checkin time", type: "min", key: "totalCheckout" },
    { head: "Total working time", type: "min", key: "totalWorkingHours" },
    { head: "Vehicle", key: "vehicle.number", isNested: true },
    // { head: "Vehicle checkin time", type: "datetime", key: "vehicle_checkin_time" },
    // { head: "Vehicle checkout time", type: "datetime", key: "vehicle_checkout_time" },
  ];

  const excelHeaders: any = [
    { label: "Name", key: "driver.name" },
    { label: "Phone", key: "driver.phone" },
    { label: "Gender", key: "driver.gender" },
    { label: "City", key: "driver.city.city_name" },
    { label: "Status", key: "status" },
    { label: "Break Start", key: "break_time" },
    { label: "Break End", key: "break_time_in" },
    { label: "Total Working Hours", key: "totalWorkingHours" },
    { label: "Store Checkin Time", key: "store_checkin_time" },
    { label: "Store Checkout Time", key: "store_checkout_time" },
  ];

  // hooks
  // useEffect(() => {
  //   let search = state.search;
  //   if(!search){
  //     search = query.get("driver");
  //   }
  //   GetManyData(search);
  // }, [state.search]);

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     setState({ timeout: Math.random() });
  //   }, autoRefreshTime);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   GetManyRefresh();
  //   getCheckinDriverCount()
  //   getCheckinBreakCount ()
  //   getCity()
  //   getStore()
  //   getDriver()
  //   getVehicle()
  // }, [state.timeout]);

  //network req
  const GetManyRefresh = async (search = "") => {
    try {
      let res: any;
      const limit = state.refreshLimit;
      const skip = 0;
      const body: any = {
        search: search || state.search,
        limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (state.filterCity.length) {
        body["filterCity"] = state.filterCity;
      }
      if (state.filterStore.length) {
        body["filterStore"] = state.filterStore;
      }
      if (state.filterVehicle.length) {
        body["filterVehicle"] = state.filterVehicle;
      }
      if (state.filterDriver.length) {
        body["filterDriver"] = state.filterDriver;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (
        checkinApiCall(
          state.dateRange[0],
          state.dateRange[1],
          state.filterCity,
          state.filterVehicle,
          state.filterStore,
          state.filterDriver,
          state.filterStatus
        )
      ) {
        delete body["limit"];
        setState({ skip: 0 });
        res = await Models.checkin.getManyCheckin(body);
        if (state.filterStatus.length && state.filterStatus !== "all_status") {
          let filterStatus = _.filter(res.data.docs, (e: any) => e.status === state.filterStatus);
          setState({ data: filterStatus, totalDocs: filterStatus.length, loading: false });
        } else setState({ data: res.data.docs, totalDocs: res.data.docs.length, loading: false });
      } else {
        res = await Models.checkin.getManyCheckin(body);
        setState({ data: res?.data.docs, totalDocs: res.data.totalDocs });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCheckinDriverCount = async () => {
    try {
      let body = {};
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      const res: any = await Models.checkin.getChekinDriverCount(body);
      setState({ checkin_driver_count: res.data });
    } catch (err: any) {
      console.log("err", err);
    }
  };

  const getCheckinBreakCount = async () => {
    try {
      let body = {};
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      const res: any = await Models.checkin.getChekinBreakCount(body);
      setState({ break_in_driver_count: res.data });
    } catch (err: any) {
      console.log("err", err);
    }
  };

  const GetManyData = async (search = "") => {
    try {
      let res: any;
      const limit = state.limit;
      const skip = search ? 0 : state.data.length;
      const body: any = {
        search: search || state.search,
        limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (state.filterCity.length) {
        body["filterCity"] = state.filterCity;
      }
      if (state.filterStore.length) {
        body["filterStore"] = state.filterStore;
      }
      if (state.filterVehicle.length) {
        body["filterVehicle"] = state.filterVehicle;
      }
      if (state.filterDriver.length) {
        body["filterDriver"] = state.filterDriver;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (
        checkinApiCall(
          state.dateRange[0],
          state.dateRange[1],
          state.filterCity,
          state.filterVehicle,
          state.filterStore,
          state.filterDriver,
          state.filterStatus
        )
      ) {
        delete body["limit"];
        setState({ skip: 0 });
        res = await Models.checkin.getManyCheckin(body);
        if (state.filterStatus.length && state.filterStatus !== "all_status") {
          let filterStatus = _.filter(res.data.docs, (e: any) => e.status === state.filterStatus);
          setState({ data: filterStatus, totalDocs: filterStatus.length, loading: false });
        } else setState({ data: res.data.docs, totalDocs: res.data.docs.length, loading: false });
      } else {
        res = await Models.checkin.getManyCheckin(body);
        setState({ data: res?.data.docs, totalDocs: res.data.totalDocs, loading: false, skip, refreshLimit: res.data.docs.length });
      }
    } catch (error) {
      setState({ loading: false });
      console.log(error);
    }
  };

  const loadMoreData = async (search = "") => {
    try {
      const limit = state.limit;
      const skip = state.data.length;
      const body: any = {
        search: search || state.search,
        limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      const res: any = await Models.checkin.getManyCheckin(body);
      setState({
        data: [...state.data, ...res?.data.docs],
        totalDocs: res.data.totalDocs,
        loading: false,
        skip,
        refreshLimit: state.refreshLimit + state.limit,
      });
    } catch (error) {
      setState({ loading: false });
      console.log(error);
    }
  };

  const DeleteCheckin = async () => {
    try {
      await Models.checkin.deleteCheckin({
        checkin_id: state.id,
      });
      setState({ id: "", deleteModal: false });
      // GetManyData();
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  const handleView = data => {
    navigate(`/view_checkin/${data?._id}`);
  };

  const getCity = async () => {
    let data: any = [];
    try {
      const res: any = await Models.city.getCityWithoutPagination({});
      for (let city of res.data) {
        data.push({
          label: city.city_value.toUpperCase(),
          value: city._id,
        });
      }
      data.unshift({
        label: "ALL CITIES",
        value: "all_cities",
      });
      setState({ cityData: data });
    } catch (err: any) {
      console.log("err", err);
    }
  };

  const getStore = async () => {
    let data: any = [
      {
        label: "ALL STORES",
        value: "all_stores",
      },
    ];
    try {
      const body: any = { getAllStore: true };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      const res: any = await Models.store.getManyStore(body);
      for (let store of res.data) {
        data.push({
          label: store.name.toUpperCase(),
          value: store._id,
        });
      }
      setState({ storeData: data });
    } catch (err: any) {
      console.log("err", err);
    }
  };

  const getDriver = async () => {
    let data: any = [
      {
        label: "ALL DRIVERS",
        value: "all_drivers",
      },
    ];
    try {
      const body: any = {
        filter: DRIVER_STATUS.APPROVED,
      };
      const res: any = await Models.driver.getAllDriver(body);
      for (let driver of res.data.docs) {
        data.push({
          label: driver.name.toUpperCase(),
          value: driver._id,
        });
      }
      setState({ driverData: data });
    } catch (err: any) {
      console.log("err", err);
    }
  };

  const getVehicle = async () => {
    let data: any = [
      {
        label: "ALL VEHICLE",
        value: "all_vehicle",
      },
    ];
    try {
      const res: any = await Models.vehicle.getAllVehicle({});
      for (let vehicle of res.data.docs) {
        data.push({
          label: vehicle.model.toUpperCase(),
          value: vehicle._id,
        });
      }
      setState({ vehicleData: data });
    } catch (err: any) {
      console.log("err", err);
    }
  };

  const filterData = async () => {
    try {
      let res: any;
      const limit = state.limit;
      const skip = 0;
      const body: any = {
        limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (state.filterCity.length) {
        body["filterCity"] = state.filterCity;
      }
      if (state.filterStore.length) {
        body["filterStore"] = state.filterStore;
      }
      if (state.filterVehicle.length) {
        body["filterVehicle"] = state.filterVehicle;
      }
      if (state.filterDriver.length) {
        body["filterDriver"] = state.filterDriver;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (
        checkinApiCall(
          state.dateRange[0],
          state.dateRange[1],
          state.filterCity,
          state.filterVehicle,
          state.filterStore,
          state.filterDriver,
          state.filterStatus
        )
      ) {
        delete body["limit"];
        setState({ skip: 0 });
        res = await Models.checkin.getManyCheckin(body);
        if (state.filterStatus.length && state.filterStatus !== "all_status") {
          let filterStatus = _.filter(res.data.docs, (e: any) => e.status === state.filterStatus);
          setState({ data: filterStatus, totalDocs: filterStatus.length, loading: false });
        } else setState({ data: res.data.docs, totalDocs: res.data.docs.length, loading: false });
      } else {
        res = await Models.checkin.getManyCheckin(body);
        setState({
          data: res.data.docs,
          totalDocs: res.data.totalDocs,
          loading: false,
          skip,
        });
      }
    } catch (err: any) {
      console.log("err", err);
    }
  };

  const exportExcelData = () => {
    let data: any = _.cloneDeep(state.data);
    for (let i = 0; i < data.length; i++) {
      data[i].driver.city.city_name = data[i].driver.city.city_name ? data[i].driver.city.city_name : "---";
      data[i].break_time = data[i].break_time ? moment(data[i].break_time).format("YYYY/MM/DD, h:mm:ss a") : "---";
      data[i].break_time_in = data[i].break_time_in ? moment(data[i].break_time_in).format("YYYY/MM/DD, h:mm:ss a") : "---";
      data[i].totalWorkingHours = data[i].totalWorkingHours ? Functions.timeConvert(data[i].totalWorkingHours) : "---";
      data[i].store_checkin_time = data[i].store_checkin_time ? moment(data[i].store_checkin_time).format("YYYY/MM/DD, h:mm:ss a") : "---";
      data[i].store_checkout_time = data[i].store_checkout_time ? moment(data[i].store_checkout_time).format("YYYY/MM/DD, h:mm:ss a") : "---";
    }
    const exportCheckinData: any = {
      data: data,
      headers: excelHeaders,
      filename: "Checkin.csv",
    };
    setState({ exportCheckinData });
    setTimeout(() => {
      exportCheckinDataRef?.current?.link?.click();
    }, 400);
  };

  // useEffect(() => {
  //   filterData();
  // }, [state.filterCity, state.filterDriver, state.filterStatus, state.filterStore, state.filterVehicle,state.dateRange]);

  return (
    <div className="checkin_screen">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="head h5">Checkin</div>
          <div className="search_wrapper">
            <div className="add_field_container">
              <Formik onSubmit={() => console.log("Submit")} initialValues={{ search: state.search }} enableReinitialize>
                <Field name={"search"}>
                  {({ field, form }) => (
                    <Select name={"search"} onChange={val => setState({ search: val })} type="driver" placeholder="Search" value={state.search} />
                  )}
                </Field>
              </Formik>
            </div>
            <div className="checkin_screen_export_button">
              <Button value="Export" onClick={() => exportExcelData()} />
            </div>
          </div>
        </div>
      </div>
      <div className="checkin_screen_driver_count">
        <div className="checkin_screen_driver_count_flex_wrapper">
          <div className="checkin_screen_driver_count_wrapper">
            <div className="chekin_screen_driver_count_heading">Checkin drivers count :</div>
            <div className="checkin_screen_driver_count_list">{state.checkin_driver_count}</div>
          </div>

          <div className="checkin_screen_driver_count_wrapper">
            <div className="chekin_screen_driver_count_heading">Drivers in break :</div>
            <div className="checkin_screen_driver_count_list">{state.break_in_driver_count}</div>
          </div>
        </div>
        <div className="driver_status_code_flex_wrapper">
          <div className="driver_staus_code_inline_wrapper">
            <div className="driver_status_code_heading">Active :</div>
            <div className="driver_status_code_image">
              <img width={10} height={10} src={Assets.active} alt="active" />
            </div>
          </div>
          <div className="driver_staus_code_inline_wrapper">
            <div className="driver_status_code_heading">In-active :</div>
            <div className="driver_status_code_image">
              <img width={10} height={10} src={Assets.inactive} alt="active" />
            </div>
          </div>
          <div className="driver_staus_code_inline_wrapper">
            <div className="driver_status_code_heading">Break :</div>
            <div className="driver_status_code_image">
              <img width={10} height={10} src={Assets.break_icon} alt="active" />
            </div>
          </div>
        </div>
      </div>

      <div className="checkin_filter_container">
        <div className="checkin_filter_heading">Filter options</div>
        <div className="checkin_filter_dropdown_wrapper">
          <div className="checkin_filter_dropdown_item">
            <DateRangePicker value={state.dateRange} onChange={(dateRange: any) => setState({ dateRange })} />
          </div>
          <div className="checkin_filter_dropdown_item">
            <SelectDropdown
              notfound={"No driver found"}
              placeholder="Select a driver"
              data={state.driverData}
              onChange={(filterDriver: any) => setState({ filterDriver: filterDriver.value })}
              value={state.filterDriver}
            />
          </div>
          <div className="checkin_filter_dropdown_item">
            <SelectDropdown
              notfound={"No city found"}
              placeholder={"Select a city"}
              data={state.cityData}
              onChange={(filterCity: any) => setState({ filterCity: filterCity.value })}
              value={state.filterCity}
            />
          </div>
          <div className="checkin_filter_dropdown_item">
            <SelectDropdown
              notfound={"No status found"}
              placeholder={"Select a status"}
              data={CheckinStatus}
              onChange={(filterStatus: any) => setState({ filterStatus: filterStatus.value })}
              value={state.filterStatus}
            />
          </div>
          <div className="checkin_filter_dropdown_item">
            <SelectDropdown
              notfound={"No store found"}
              placeholder={"Select a store"}
              data={state.storeData}
              onChange={(filterStore: any) => setState({ filterStore: filterStore.value })}
              value={state.filterStore}
            />
          </div>
          <div className="checkin_filter_dropdown_item">
            <SelectDropdown
              notfound={"No vehicle found"}
              placeholder={"Select a vehicle"}
              data={state.vehicleData}
              onChange={(filterVehicle: any) => setState({ filterVehicle: filterVehicle.value })}
              value={state.filterVehicle}
            />
          </div>
        </div>
      </div>
      <div className="checkintable">
        <Table
          data={state.data}
          totalDocs={state.totalDocs}
          loading={state.loading}
          theads={thead}
          loadMore={() => loadMoreData()}
          link="checkin"
          actions={[
            {
              icon: "view",
              onClick: handleView,
            },
          ]}
          imageKey="logo"
        />
      </div>
      {state.exportCheckinData ? (
        <>
          <CSVLink ref={exportCheckinDataRef} {...state.exportCheckinData} />
        </>
      ) : null}
      <CustomModal
        center
        open={state.deleteModal}
        classNames={{ modalContainer: "delete_modal_container" }}
        onClose={() => setState({ deleteModal: false })}
      >
        <DeletePopup onPress={DeleteCheckin} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>
    </div>
  );
}
