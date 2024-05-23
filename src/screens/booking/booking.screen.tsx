import React, { useEffect } from "react";
import { bookingApiCall, toastifyError, useQuery, useSetState } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import "./booking.screen.scss";
import "react-responsive-modal/styles.css";
import DeletePopup from "components/delete_popup/delete_popup.component";
import Table from "components/table/table.component";
import Button from "common_components/ui/button/button.ui";
import Search from "common_components/ui/search/search.ui";
import CustomModal from "common_components/ui/modal/modal.component";
import { useNavigate } from "react-router-dom";
import { BOOKING_FILTER } from "constants/booking.constant";
import { Field, Formik } from "formik";
import Select from "components/select/select.component";
import { BookingStatus, PaymentType, ROLES } from "constants/user.constant";
import { CSVLink } from "react-csv";
import moment from "moment";
import DatePicker from "react-datepicker";
import _ from "lodash";
import { autoRefreshTime } from "utils/constant.utils";
import DateRangePicker from "common_components/ui/date_range_picker/date_range.component";
import SelectDropdown from "common_components/ui/select_dropdown/select_dropdown.component";
import { DRIVER_STATUS } from "constants/driver.constant";

export default function Booking() {
  const navigate = useNavigate();
  const query = useQuery();
  const org = localStorage.getItem("org");
  const role = localStorage.getItem("role");
  let city: any = localStorage.getItem("city");
  city = JSON.parse(city);
  //redux

  //state
  const [state, setState] = useSetState({
    data: [],
    filteredData: [],
    search: "",
    openModal: false,
    viewModal: false,
    deleteModal: false,
    loading: true,
    limit: 20,
    refreshLimit: 20,
    selectedFilter: query.get("filter") || BOOKING_FILTER.LIVE,
    timeout: 0,
    excelData: [],
    isOpenModel: false,
    start_date: "",
    end_date: "",
    export: false,
    exportLoader: false,
    dateRange: ["", ""],
    driverData: [],
    filterDriver: "",
    cityData: [],
    filterCity: "",
    filterStore: "",
    storeData: [],
    filterStatus: "",
    filterPaymentType: "",
    exportBookingData: "",
  });

  // ref
  const exportBookingRef: any = React.useRef<{ link: HTMLAnchorElement }>(null);

  const thead = [
    { head: "Booking id", key: "booking_id" },
    { head: "Order id", key: "order_id" },
    { head: "City", key: "city.city_name", isNested: true },
    { head: "Date", type: "datetime", key: "created_at" },
    { head: "Store", key: "store.name", isNested: true },
    { head: "Driver", key: "driver.name", isNested: true },
    { head: "Delivery address", key: "delivery_address.address", isNested: true },
    { head: "Payment Type", key: "payment_type" },
    { head: "Status", key: "status.status", isNested: true },
  ];

  const excelHeaders = [
    { label: "Booking id", key: "booking_id" },
    { label: "Order ID", key: "order_id" },
    { label: "Driver", key: "driver.name" },
    { label: "City", key: "city.name" },
    { label: "Date", key: "created_at" },
    { label: "Store", key: "store.name" },
    { label: "Pickup_address", key: "pickup_address" },
    { label: "Delivery address", key: "delivery_address" },
    { label: "Payment Type", key: "payment_type" },
    { label: "Driver accept time", key: "driver_accept_time" },
    { label: "Driver Pickup time", key: "pickup_time" },
    { label: "Cancelled time", key: "cancelled_time" },
    { label: "Cancel reason", key: "cancel_reason" },
    { label: "Driver Delivery time", key: "delivery_time" },
    { label: "Delivery charge", key: "delivery_charge" },
    { label: "Status", key: "status_text" },
  ];

  // hooks
  useEffect(() => {
    GetManyData();
  }, [state.search]);

  useEffect(() => {
    let interval = setInterval(() => {
      setState({ timeout: Math.random() });
    }, autoRefreshTime);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getDriver();
    getCity();
    getStore();
  }, []);

  const GetManyData = async (reset = false, filter = state.selectedFilter, store = state.store, driver = state.driver) => {
    try {
      let res: any;
      const limit = state.limit;
      const skip = reset ? 0 : state.data.length;
      const body: any = {
        search: state.search,
        limit,
        skip,
        filter,
        store,
        driver,
      };

      if (org) {
        body.org = org;
      }

      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      // @ts-ignore
      if (typeof state?.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (state.filterDriver.length) {
        body["filterDriver"] = state.filterDriver;
      }
      if (state.filterStore.length) {
        body["filterStore"] = state.filterStore;
      }
      if (state.filterCity.length) {
        body["city"] = state.filterCity;
      }
      if (state.filterStatus.length) {
        if (state.filterStatus !== "all_status") delete body["filter"];
        body["filterStatus"] = state.filterStatus;
      }
      if (state.filterPaymentType.length) {
        body["filterPaymentType"] = state.filterPaymentType;
      }
      if (
        bookingApiCall(
          state.dateRange[0],
          state.dateRange[1],
          state.filterDriver,
          state.filterCity,
          state.filterStatus,
          state.filterStore,
          state.filterPaymentType
        )
      ) {
        delete body["limit"];
        // res = await Models.booking.getManyBooking(body);
        // setState({ data: res?.data?.docs, totalDocs: res.data.docs.length });
      } else {
        // res = await Models.booking.getManyBooking(body);
        // if (reset) {
        //   setState({ data: res?.data?.docs, totalDocs: res.data.totalDocs, loading: false, skip });
        // } else {
        //   setState({ data: [...state.data, ...res?.data?.docs], totalDocs: res.data.totalDocs, loading: false, skip });
        // }
      }
      setState({ refreshLimit: res.data.docs.length });
    } catch (error) {
      setState({ loading: false });
      console.log(error);
    }
  };

  const DeleteBooking = async () => {
    try {
      await Models.booking.deleteBooking({
        id: state.id,
      });
      setState({ id: "", deleteModal: false });
      GetManyData(true);
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  const handleView = data => {
    navigate(`/view_booking/${data?._id}`);
  };
  const handleEdit = data => {
    navigate(`/edit_booking/${data._id}`);
  };
  const handleDelete = data => {
    setState({ id: data._id, deleteModal: true });
  };

  const handleFilter = filter => {
    setState({ selectedFilter: filter });
    navigate(`/booking?filter=${filter}`);
    GetManyData(true, filter);
  };

  const searchDriver = value => {
    setState({ driver: value, data: [] });
    GetManyData(true, state.filter, state.store, value);
  };

  const searchStore = value => {
    setState({ store: value, data: [] });
    GetManyData(true, state.filter, value, state.driver);
  };

  const exportExcelData = async () => {
    let data = _.cloneDeep(state.data);
    let array: any[] = [];
    data.map(item => {
      const body = {
        ...item,
        created_at: moment(item.created_at).format("YYYY/MM/DD, h:mm:ss a"),
      };
      if (!_.isEmpty(item.delivery_address)) {
        body.delivery_address = `${item.delivery_address.name} , ${item.delivery_address.phone} , ${item.delivery_address.address} , ${item.delivery_address.city} , ${item.delivery_address.pincode}`;
      }
      if (!_.isEmpty(item.pickup_address)) {
        body.pickup_address = `${item.pickup_address.name} , ${item.pickup_address.phone} , ${item.pickup_address.address} , ${item.pickup_address.city} , ${item.pickup_address.pincode}`;
      }
      if (_.isEmpty(item.cancelled_time)) {
        body.cancelled_time = "---";
      } else body.cancelled_time = moment(item.cancelled_time).format("YYYY/MM/DD, h:mm:ss a");

      if (_.isEmpty(item.cancel_reason)) {
        body.cancel_reason = "---";
      }

      if (_.isEmpty(item.delivery_time)) {
        body.delivery_time = "---";
      } else body.delivery_time = moment(item.delivery_time).format("YYYY/MM/DD, h:mm:ss a");

      if (_.isEmpty(item.driver_accept_time)) {
        body.driver_accept_time = "---";
      } else body.driver_accept_time = moment(item.driver_accept_time).format("YYYY/MM/DD, h:mm:ss a");

      if (_.isEmpty(item.delivery_charge)) {
        body.delivery_charge = "---";
      }

      if (_.isEmpty(item.driver_accept_time)) {
        body.driver_accept_time = "---";
      } else body.driver_accept_time = moment(item.driver_accept_time).format("YYYY/MM/DD, h:mm:ss a");

      if (_.isEmpty(item.pickup_time)) {
        body.pickup_time = "---";
      } else body.pickup_time = moment(item.pickup_time).format("YYYY/MM/DD, h:mm:ss a");

      array.push(body);
    });
    const exportBookingData = {
      data: array,
      headers: excelHeaders,
      filename: "Booking.csv",
    };
    setState({ exportBookingData });
    setTimeout(() => {
      exportBookingRef?.current?.link?.click();
    }, 400);
  };

  const getDriver = async () => {
    let data: any = [];
    try {
      const body: any = {
        filter: DRIVER_STATUS.APPROVED,
      };
      // const res: any = await Models.driver.getAllDriver(body);
      // for (let driver of res.data.docs) {
      //   data.push({
      //     label: driver.name.toUpperCase(),
      //     value: driver._id,
      //   });
      // }
      // data = _.orderBy(data, ["label"]);
      // data.unshift({
      //   label: "ALL DRIVERS",
      //   value: "all_drivers",
      // });
      setState({ driverData: data });
    } catch (err: any) {
      console.log("err", err);
    }
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
      data = _.orderBy(data, ["label"]);
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
    let data: any = [];
    try {
      const body: any = { getAllStore: true };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      // const res: any = await Models.store.getManyStore(body);
      // for (let store of res.data) {
      //   data.push({
      //     label: store.name.toUpperCase(),
      //     value: store._id,
      //   });
      // }
      data = _.orderBy(data, ["label"]);
      data.unshift({
        label: "ALL STORES",
        value: "all_stores",
      });
      setState({ storeData: data });
    } catch (err: any) {
      console.log("err", err);
    }
  };

  const filterData = async (reset: boolean, filter = state.selectedFilter) => {
    try {
      const skip = reset ? 0 : state.data.length;
      let res: any;
      const body: any = {
        search: state.search,
        limit: state.limit,
        filter: state.selectedFilter,
        skip,
      };
      if (org) {
        body.org = org;
      }
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      // @ts-ignore
      if (typeof state?.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (state.filterDriver.length) {
        body["filterDriver"] = state.filterDriver;
      }
      if (state.filterStore.length) {
        body["filterStore"] = state.filterStore;
      }
      if (state.filterCity.length) {
        body["filterCity"] = state.filterCity;
      }
      if (state.filterStatus.length) {
        if (state.filterStatus !== "all_status") delete body["filter"];
        body["filterStatus"] = state.filterStatus;
      }
      if (state.filterPaymentType.length) {
        body["filterPaymentType"] = state.filterPaymentType;
      }
      if (
        bookingApiCall(
          state.dateRange[0],
          state.dateRange[1],
          state.filterDriver,
          state.filterCity,
          state.filterStatus,
          state.filterStore,
          state.filterPaymentType
        )
      ) {
        delete body["limit"];
        // res = await Models.booking.getManyBooking(body);
        // setState({ data: res?.data?.docs, totalDocs: res.data.docs.length, loading: false });
      } else {
        // res = await Models.booking.getManyBooking(body);
        // setState({ data: res?.data?.docs, totalDocs: res.data.totalDocs, loading: false });
      }
    } catch (err) {
      setState({ loading: false });
      console.log("err", err);
    }
  };

  useEffect(() => {
    filterData(true);
  }, [state.filterDriver, state.filterStore, state.filterCity, state.filterStatus, state.filterPaymentType, state.dateRange]);

  return (
    <div className="booking_screen">
      <div className="header_container">
        <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }} className="header_wrapper">
          <div className="head h5">Booking</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {role !== ROLES.ADMIN && (
              <Button
                value="Add Booking"
                onClick={() => {
                  navigate("/add_booking");
                }}
              />
            )}
            <Button value="Export" onClick={() => exportExcelData()} />
          </div>
          {/* </div> */}
        </div>
        <div className="booking_filter_container">
          <div className="booking_filter_heading">Filter options</div>
          <div className="booking_filter_dropdown_wrapper">
            <div className="booking_filter_dropdown_item">
              <DateRangePicker value={state.dateRange} onChange={(dateRange: any) => setState({ dateRange })} />
            </div>
            <div className="booking_filter_dropdown_item">
              <SelectDropdown
                notfound={"No driver found"}
                placeholder="Select a driver"
                data={state.driverData}
                onChange={(filterDriver: any) => setState({ filterDriver: filterDriver.value })}
                value={state.filterDriver}
              />
            </div>
            <div className="booking_filter_dropdown_item">
              <SelectDropdown
                notfound={"No city found"}
                placeholder={"Select a city"}
                data={state.cityData}
                onChange={(filterCity: any) => setState({ filterCity: filterCity.value })}
                value={state.filterCity}
              />
            </div>
            <div className="booking_filter_dropdown_item">
              <SelectDropdown
                notfound={"No status found"}
                placeholder={"Select a status"}
                data={BookingStatus}
                onChange={(filterStatus: any) => setState({ filterStatus: filterStatus.value })}
                value={state.filterStatus}
              />
            </div>
            <div className="booking_filter_dropdown_item">
              <SelectDropdown
                notfound={"No store found"}
                placeholder={"Select a store"}
                data={state.storeData}
                onChange={(filterStore: any) => setState({ filterStore: filterStore.value })}
                value={state.filterStore}
              />
            </div>
            <div className="booking_filter_dropdown_item">
              <SelectDropdown
                notfound={"No payment type found"}
                placeholder={"Select a payment type"}
                data={PaymentType}
                onChange={(filterPaymentType: any) => setState({ filterPaymentType: filterPaymentType.value })}
                value={state.filterPaymentType}
              />
            </div>
          </div>
        </div>
        <div className="booking_filters">
          <div
            onClick={() => handleFilter(BOOKING_FILTER.LIVE)}
            className={`button ${BOOKING_FILTER.LIVE === state.selectedFilter ? "selected" : ""}`}
          >
            Live
          </div>
          <div
            onClick={() => handleFilter(BOOKING_FILTER.COMPLETED)}
            className={`button ${BOOKING_FILTER.COMPLETED === state.selectedFilter ? "selected" : ""}`}
          >
            Completed
          </div>
          <div
            onClick={() => handleFilter(BOOKING_FILTER.CANCELLED)}
            className={`button ${BOOKING_FILTER.CANCELLED === state.selectedFilter ? "selected" : ""}`}
          >
            Cancelled
          </div>
          {role === ROLES.ADMIN && (
            <div
              onClick={() => handleFilter(BOOKING_FILTER.MANUAL)}
              className={`button ${BOOKING_FILTER.MANUAL === state.selectedFilter ? "selected" : ""}`}
            >
              Manual
            </div>
          )}
          <div onClick={() => handleFilter(BOOKING_FILTER.ALL)} className={`button ${BOOKING_FILTER.ALL === state.selectedFilter ? "selected" : ""}`}>
            All
          </div>
        </div>
      </div>
      <div className="bookingtable">
        <Table
          data={state.data}
          totalDocs={state.totalDocs}
          loading={state.loading}
          theads={thead}
          link="booking"
          loadMore={() => {}}
          actions={[
            {
              icon: "view",
              onClick: handleView,
            },
            // {
            //   icon: 'edit',
            //   onClick: handleEdit,
            // },
            // {
            //   icon: 'delete',
            //   onClick: handleDelete
            // },
          ]}
          imageKey="logo"
        />
      </div>
      <CustomModal
        center
        open={state.deleteModal}
        classNames={{ modalContainer: "delete_modal_container" }}
        onClose={() => setState({ deleteModal: false })}
      >
        <DeletePopup onPress={DeleteBooking} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>

      {state.exportBookingData ? (
        <>
          <CSVLink ref={exportBookingRef} {...state.exportBookingData} />
        </>
      ) : null}
    </div>
  );
}
