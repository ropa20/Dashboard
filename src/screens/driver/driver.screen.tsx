import React, { useEffect, useMemo, useRef } from "react";
import { toastify, useSetState, toastifyError, driverApiCall } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import "./driver.screen.scss";
import "react-responsive-modal/styles.css";
import DeletePopup from "components/delete_popup/delete_popup.component";
import Table from "components/table/table.component";
import Button from "common_components/ui/button/button.ui";
import Search from "common_components/ui/search/search.ui";
import CustomModal from "common_components/ui/modal/modal.component";
import { useNavigate } from "react-router-dom";
import { DRIVER_STATUS } from "constants/driver.constant";
import { CSVLink } from "react-csv";
import moment from "moment";
import DatePicker from "react-datepicker";
import _ from "lodash";
import { autoRefreshTime } from "utils/constant.utils";
import { DocumentList, DriverStatus } from "constants/user.constant";
import CheckBox from "common_components/ui/check_box/check_box.ui";
import SelectDropdown from "common_components/ui/select_dropdown/select_dropdown.component";
import DateRangePicker from "common_components/ui/date_range_picker/date_range.component";
import TextareaComponent from "common_components/ui/text_area/textarea.component";

export default function Driver() {
  const navigate = useNavigate();
  const org = localStorage.getItem("org");
  let city: any = localStorage.getItem("city");
  city = JSON.parse(city);

  // ref
  const csvLinkRef: any = React.useRef<{ link: HTMLAnchorElement }>(null);
  const exportDriverData: any = React.useRef<{ link: HTMLAnchorElement }>(null);

  //state
  const [state, setState] = useSetState({
    data: [],
    filteredData: [],
    selectedFilter: DRIVER_STATUS.APPROVED,
    search: "",
    openModal: false,
    viewModal: false,
    deleteModal: false,
    loading: true,
    limit: 20,
    skip: 0,
    timeout: 0,
    refreshLimit: 20,
    excelData: [],
    isOpenModel: false,
    start_date: "",
    end_date: "",
    export: false,
    exportLoader: false,
    rejectDriverData: "",
    driver_id: "",
    rejctModal: false,
    remarks: "",
    thead: "",
    filterCity: "",
    filterStatus: "",
    filterOnboarded: "",
    cityData: [],
    statusData: [],
    onboardedData: [],
    dateRange: ["", ""],
    driverListExport: "",
    approvalModal: false,
  });

  const thead = [
    { head: "ID", key: "id" },
    { head: "Requested date", key: "created_at", type: "date" },
    { head: "Name", key: "name" },
    { head: "Onboarded", key: "onboarded_by.username", isNested: true },
    { head: "Phone", key: "phone" },
    { head: "City", key: "city.city_name", isNested: true },
  ];

  const excelHeaders: any = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Phone", key: "phone" },
    { label: "Gender", key: "gender" },
    { label: "City", key: "city.city_name" },
    { label: "Onboarded by", key: "onboarded_by.username" },
    { label: "Parents name", key: "parents_name" },
    { label: "Driving licence front", key: "driving_licence_front" },
    { label: "Driving licence back", key: "driving_licence_back" },
    { label: "Education", key: "education" },
    { label: "Emergency contact", key: "emergency_contact" },
    { label: "Bank details", key: "bank_details" },
    { label: "Primary address", key: "primary_address" },
    { label: "Own vehicle", key: "own_vehicle" },
    { label: "Driver minimum guarentee", key: "driver_minimum_guarentee" },
    { label: "Requested date", key: "requested_at" },
    { label: "Approved date", key: "approved_at" },
  ];

  // hooks
  useEffect(() => {
    GetManyData(true);
  }, [state.search]);

  useEffect(() => {
    let interval = setInterval(() => {
      setState({ timeout: Math.random() });
    }, autoRefreshTime);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterStatus();
    getCity();
  }, []);

  const GetManyData = async (reset = false, filter = state.selectedFilter) => {
    try {
      if (reset) {
        setState({ loading: true, data: [] });
      }
      let res: any;
      const skip = reset ? 0 : state.data.length;
      const body: any = {
        search: state.search,
        limit: state.limit,
        skip,
        filter,
      };

      if (org) {
        body.org = org;
      }
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (state.filterCity.length) {
        body["filter_city"] = state.filterCity;
      }
      if (state.filterStatus.length) {
        body["filter_status"] = state.filterStatus;
        if (state.filterStatus !== "all_status") delete body["filter"];
      }
      if (state.filterOnboarded.length) {
        body["filter_onboarded"] = state.filterOnboarded;
      }
      // @ts-ignore
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      // @ts-ignore
      if (typeof state?.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (driverApiCall(state.dateRange[0], state.dateRange[1], state.filterCity, state.filterStatus, state.filterOnboarded)) {
        delete body["limit"];
        setState({ skip: 0 });
        // res = await Models.driver.getManyDriver(body);
        // setState({ data: res.data.docs, loading: false, totalDocs: res.data.docs.length });
      } else {
        // res = await Models.driver.getManyDriver(body);
        // const data = res?.data?.docs;
        // if (reset) {
        //   setState({ data, loading: false, totalDocs: res.data.totalDocs, skip });
        // } else {
        //   setState({ data: [...state.data, ...data], loading: false, totalDocs: res.data.totalDocs, skip });
        // }
        setState({ refreshLimit: res.data.docs.length });
      }

      let onboarded = _.filter([...state.data, ...res.data.docs], (e: any) => e.onboarded_by && e);
      if (!_.isEmpty(onboarded)) {
        onboarded = _.uniqBy(onboarded, (e: any) => e.onboarded_by._id);
        let data: any = [];
        for (let onboard of onboarded) {
          data.push({
            label: onboard.onboarded_by?.username?.toUpperCase(),
            value: onboard.onboarded_by._id,
          });
        }
        data = _.orderBy(data, ["label"]);
        data.unshift({
          value: "all_onboarded",
          label: "ALL ONBOARDED",
        });
        setState({ onboardedData: data });
        setState({ onboardedData: data });
      }
    } catch (error) {
      setState({ loading: false });
      console.log(error);
      toastifyError(error);
    }
  };

  const DeleteDriver = async () => {
    try {
      await Models.driver.deleteDriver({
        driver_id: state.id,
      });
      setState({ id: "", deleteModal: false });
      GetManyData(true);
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handlePayout = data => {
    navigate(`/payout?driver=${data?._id}`);
  };
  const handleCheckin = data => {
    navigate(`/checkin?driver=${data?._id}`);
  };

  const handleView = data => {
    navigate(`/view_driver/${data?._id}`);
  };
  const handleEdit = data => {
    navigate(`/edit_driver/${data._id}`);
  };
  const handleDelete = data => {
    setState({ id: data._id, deleteModal: true });
  };

  const hyperLink = (url: string) => {
    const csvData = [[`HYPERLINK("${url}", "${url}")`]];
    return csvData;
  };

  const handleExcelSheet = (data: any) => {
    if (data.primary_address) {
      data["primary_address"] = `${data.primary_address.address} , ${data.primary_address.city} , ${data.primary_address.pincode} `;
    }
    if (data.requested_at) {
      data["requested_at"] = moment(data.requested_at).format("YYYY/MM/DD, h:mm:ss a");
    }
    if (data.approved_at) {
      data["approved_at"] = moment(data.approved_at).format("YYYY/MM/DD, h:mm:ss a");
    }
    if (!_.isEmpty(data.secondary_address)) {
      console.log("true");
      data["secondary_address"] = `${data.secondary_address.address} , ${data.secondary_address.city} , ${data.secondary_address.pincode} `;
      excelHeaders.splice(11, 0, { label: "Secondary address", key: "secondary_address" });
    }
    if (data.bank_details) {
      data["bank_details"] = `${data.bank_details.customer_name} , ${data.bank_details.account_number} , ${data.bank_details.ifsc_code}`;
    }
    if (data.vehicle_info) {
      if (data.vehicle_info.image) {
        data.vehicle_info.image = data.vehicle_info.image;
        excelHeaders.push({
          label: "Bike image",
          key: "vehicle_info.image",
        });
      }

      if (data.vehicle_info.insurance) {
        data.vehicle_info.insurance = data.vehicle_info.insurance;
        excelHeaders.push({
          label: "Insurance",
          key: "vehicle_info.insurance",
        });
      }
      if (data.vehicle_info.rc_book) {
        data.vehicle_info.rc_book = data.vehicle_info.rc_book;
        excelHeaders.push({
          label: "Rc book",
          key: "vehicle_info.rc_book",
        });
      }
    }

    const rejectDriverData = {
      data: [data],
      headers: excelHeaders,
      filename: "Driver.csv",
    };
    setState({ rejectDriverData });
    setTimeout(() => {
      csvLinkRef?.current?.link?.click();
    }, 400);
  };

  const handleFilter = status => {
    // const filteredData = data.filter(value => value.status === status);
    GetManyData(true, status);
    setState({ selectedFilter: status, data: [] });
  };

  const handleStatus = async (driver_id, status) => {
    if (!_.isEmpty(state.remarks)) {
      try {
        const body = {
          driver_id,
          status,
        };
        if (status === DRIVER_STATUS.REJECTED) body["remarks"] = state.remarks;
        if (status === DRIVER_STATUS.APPROVED) body["remarks"] = state.remarks;
        await Models.driver.editDriver(body);
        GetManyData(true);
        toastify("Driver status updated");
        setState({
          rejectModal: false,
          remarks: "",
          approvalModal: false,
        });
      } catch (err) {
        toastifyError(err);
        console.log(err);
      }
    } else {
      toastifyError("Please enter a reasons");
    }
  };

  const handleReject = (data: any) => {
    setState({ driver_id: data._id, rejectModal: true });
  };

  const handleApprovel = (data: any) => {
    setState({ driver_id: data._id, approvalModal: true });
  };

  const checkboxHandle = (data: any) => {
    let checkbox: any = state.rejectReasons;
    if (checkbox.includes(data)) {
      const findIndex = _.findIndex(checkbox, (e: any) => {
        return e === data;
      });
      checkbox.splice(findIndex, 1);
      setState({ rejectReasons: checkbox });
    } else {
      checkbox.push(data);
      setState({ rejectReasons: checkbox });
    }
  };

  const exportExcelData = async () => {
    try {
      let array: any[] = [];
      state.data.map(item => {
        const body = {
          ...item,
          requested_at: moment(item.requested_at).format("YYYY/MM/DD, h:mm:ss a"),
          approved_at: moment(item.approved_at).format("YYYY/MM/DD, h:mm:ss a"),
          primary_address: `${item.primary_address.address} , ${item.primary_address.city} , ${item.primary_address.pincode} `,
        };
        if (!_.isEmpty(item.secondary_address)) {
          body.secondary_address = `${item.secondary_address.address} , ${item.secondary_address.city} , ${item.secondary_address.pincode} `;
        }
        if (!_.isEmpty(item.bank_details)) {
          body.bank_details = `${item.bank_details.customer_name} , ${item.bank_details.account_number} , ${item.bank_details.ifsc_code}`;
        }
        array.push(body);
      });
      const driverListExport = {
        data: array,
        headers: excelHeaders,
        filename: "Driver.csv",
      };
      setState({ driverListExport });
      setTimeout(() => {
        exportDriverData?.current?.link?.click();
      }, 400);
      setState({ excelData: array, export: true, exportLoader: false });
    } catch (error) {
      setState({ exportLoader: false });
      console.log(error);
    }
  };

  const statusHeading = [{ head: "Status", key: "activity_status", type: "statuscheck" }];

  const tableHeading = () => {
    if (state.selectedFilter === DRIVER_STATUS.APPROVED) {
      return thead.concat(statusHeading);
    } else {
      return thead;
    }
  };

  const getCity = async () => {
    let data: any = [];
    try {
      const body: any = {
        search: state.search,
        limit: state.limit,
      };
      const res: any = await Models.city.getCityWithoutPagination(body);
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

  const filterStatus = async () => {
    let data: any = [];
    for (let driver of DriverStatus) {
      data.push({
        label: driver,
        value: driver,
      });
    }
    data = _.orderBy(data, ["label"]);
    data.unshift({
      label: "ALL STATUS",
      value: "all_status",
    });
    setState({ statusData: data });
  };

  // filterBased
  const filterData = async reset => {
    try {
      const skip = reset ? 0 : state.data.length;
      let res: any;
      const body: any = {
        search: state.search,
        limit: state.limit,
        filter: state.selectedFilter,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (state.filterCity.length) {
        body["filter_city"] = state.filterCity;
      }
      if (state.filterStatus.length) {
        body["filter_status"] = state.filterStatus;
        if (state.filterStatus !== "all_status") delete body["filter"];
      }
      if (state.filterOnboarded.length) {
        body["filter_onboarded"] = state.filterOnboarded;
      }
      // @ts-ignore
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      // @ts-ignore
      if (typeof state?.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      // if (driverApiCall(state.dateRange[0], state.dateRange[1], state.filterCity, state.filterStatus, state.filterOnboarded)) {
      //   delete body["limit"];
      //   setState({ skip: 0 });
      //   res = await Models.driver.getManyDriver(body);
      //   setState({ data: res.data.docs, loading: false, totalDocs: res.data.docs.length });
      // } else {
      //   res = await Models.driver.getManyDriver(body);
      //   const data = res?.data?.docs;
      //   setState({ data, loading: false, totalDocs: res.data.totalDocs, skip });
      // }
      let onboarded = _.filter(res.data.docs, (e: any) => e.onboarded_by && e);
      if (!_.isEmpty(onboarded)) {
        onboarded = _.uniqBy(onboarded, (e: any) => e.onboarded_by._id);
        let data: any = [];
        for (let onboard of onboarded) {
          data.push({
            label: onboard.onboarded_by?.username?.toUpperCase(),
            value: onboard.onboarded_by._id,
          });
        }
        data = _.orderBy(data, ["label"]);
        data.unshift({
          value: "all_onboarded",
          label: "ALL ONBOARDED",
        });
        setState({ onboardedData: data });
        setState({ onboardedData: data });
      }
    } catch (err: any) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    if (state.filterCity.length || state.filterStatus.length || state.filterOnboarded.length || typeof state.dateRange[0] === "string" || "object") {
      filterData(true);
    }
  }, [state.filterCity, state.filterStatus, state.filterOnboarded, state.dateRange[0], state.dateRange[1]]);

  return (
    <div className="driver_screen">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="head h5">Driver</div>
          <div className="search_wrapper">
            <Search value={state.search} onChange={search => setState({ search })} />
            <Button
              value="Add Driver"
              onClick={() => {
                navigate("/add_driver");
              }}
            />
            <Button value="Export" onClick={() => exportExcelData()} />
          </div>
        </div>
        <div className="driver_filter_container">
          <div className="driver_filter_heading">Filter options</div>
          <div className="driver_filter_dropdown_wrapper">
            <div className="driver_filter_dropdown_item">
              <DateRangePicker value={state.dateRange} onChange={(dateRange: any) => setState({ dateRange })} />
            </div>
            <div className="driver_filter_dropdown_item">
              <SelectDropdown
                notfound={"No city found"}
                placeholder="Select a city"
                data={state.cityData}
                onChange={(filterCity: any) => setState({ filterCity: filterCity.value })}
                value={state.filterCity}
              />
            </div>
            <div className="driver_filter_dropdown_item">
              <SelectDropdown
                notfound={"No status found"}
                placeholder={"Select a status"}
                data={state.statusData}
                onChange={(filterStatus: any) => setState({ filterStatus: filterStatus.value })}
                value={state.filterStatus}
              />
            </div>
            <div className="driver_filter_dropdown_item">
              <SelectDropdown
                notfound={"Onboarded person not found"}
                placeholder={"Select a onboarded person"}
                data={state.onboardedData}
                onChange={(filterOnboarded: any) => setState({ filterOnboarded: filterOnboarded.value })}
                value={state.filterOnboarded}
              />
            </div>
          </div>
        </div>
        <div className="driver_filters">
          <div
            onClick={() => handleFilter(DRIVER_STATUS.APPROVED)}
            className={`button ${DRIVER_STATUS.APPROVED === state.selectedFilter ? "selected" : ""}`}
          >
            Approved
          </div>
          <div
            onClick={() => handleFilter(DRIVER_STATUS.REQUESTED)}
            className={`button ${DRIVER_STATUS.REQUESTED === state.selectedFilter ? "selected" : ""}`}
          >
            Requested
          </div>
          <div
            onClick={() => handleFilter(DRIVER_STATUS.REJECTED)}
            className={`button ${DRIVER_STATUS.REJECTED === state.selectedFilter ? "selected" : ""}`}
          >
            Rejected
          </div>
          <div
            onClick={() => handleFilter(DRIVER_STATUS.DELETE_REQUEST)}
            className={`button ${DRIVER_STATUS.DELETE_REQUEST === state.selectedFilter ? "selected" : ""}`}
          >
            Delete requested
          </div>
          <div
            onClick={() => handleFilter(DRIVER_STATUS.RESIGNED)}
            className={`button ${DRIVER_STATUS.RESIGNED === state.selectedFilter ? "selected" : ""}`}
          >
            Resigned
          </div>
          <div
            onClick={() => handleFilter(DRIVER_STATUS.TERMINATED)}
            className={`button ${DRIVER_STATUS.TERMINATED === state.selectedFilter ? "selected" : ""}`}
          >
            Terminated
          </div>
        </div>
      </div>
      <div className="drivertable">
        <Table
          data={state.data}
          totalDocs={state.totalDocs}
          loading={state.loading}
          theads={tableHeading()}
          link="driver"
          loadMore={() => {}}
          actions={
            state.selectedFilter === DRIVER_STATUS.APPROVED
              ? [
                  {
                    icon: "vehicle",
                    onClick: handleCheckin,
                  },
                  {
                    icon: "payout",
                    onClick: handlePayout,
                  },
                  {
                    icon: "view",
                    onClick: handleView,
                  },
                  {
                    icon: "edit",
                    onClick: handleEdit,
                  },
                  {
                    icon: "delete",
                    onClick: handleDelete,
                  },
                ]
              : state.selectedFilter === DRIVER_STATUS.REQUESTED
              ? [
                  {
                    icon: "view",
                    onClick: handleView,
                  },
                  {
                    icon: "delete",
                    text: "Approve",
                    textBackground: "#734F96",
                    hideIcon: true,
                    onClick: handleApprovel,
                    // onClick: item => handleStatus(item._id, DRIVER_STATUS.APPROVED),
                  },
                  {
                    icon: "delete",
                    text: "Reject",
                    textBackground: "#ff754c",
                    hideIcon: true,
                    onClick: handleReject,
                    // onClick: item => handleStatus(item._id, DRIVER_STATUS.REJECTED),
                  },
                ]
              : state.selectedFilter === DRIVER_STATUS.REJECTED
              ? [
                  {
                    icon: "view",
                    onClick: handleView,
                  },
                  {
                    icon: "edit",
                    onClick: handleEdit,
                  },
                  {
                    icon: "excel",
                    onClick: handleExcelSheet,
                  },
                  {
                    icon: "delete",
                    onClick: handleDelete,
                  },
                ]
              : state.selectedFilter === DRIVER_STATUS.DELETE_REQUEST
              ? [
                  {
                    icon: "view",
                    onClick: handleView,
                  },
                  {
                    icon: "delete",
                    onClick: handleDelete,
                  },
                ]
              : state.selectedFilter === DRIVER_STATUS.RESIGNED
              ? [
                  {
                    icon: "view",
                    onClick: handleView,
                  },
                  {
                    icon: "edit",
                    onClick: handleEdit,
                  },
                  {
                    icon: "delete",
                    onClick: handleDelete,
                  },
                ]
              : state.selectedFilter === DRIVER_STATUS.TERMINATED
              ? [
                  {
                    icon: "view",
                    onClick: handleView,
                  },
                  {
                    icon: "edit",
                    onClick: handleEdit,
                  },
                  {
                    icon: "delete",
                    onClick: handleDelete,
                  },
                ]
              : []
          }
          imageKey="logo"
        />
      </div>
      {state.rejectDriverData ? (
        <>
          <CSVLink ref={csvLinkRef} {...state.rejectDriverData} />
        </>
      ) : null}

      {state.driverListExport ? (
        <>
          <CSVLink ref={exportDriverData} {...state.driverListExport} />
        </>
      ) : null}
      <CustomModal
        center
        open={state.deleteModal}
        classNames={{ modalContainer: "delete_modal_container" }}
        onClose={() => setState({ deleteModal: false })}
      >
        <DeletePopup onPress={DeleteDriver} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>
      {/* reject Modal */}
      <CustomModal
        center
        open={state.rejectModal}
        classNames={{ modalContainer: "delete_modal_container" }}
        onClose={() => setState({ rejectModal: false, remarks: "" })}
      >
        <div className="reject_modal_container">
          <div className="reject_heading">Reason for rejection</div>
          <div className="rejection_document_wrapper">
            <TextareaComponent placeholder="Enter rejection reasons" value={state.remarks} onChange={(remarks: any) => setState({ remarks })} />
          </div>
          <div className="reject_modal_button">
            <div
              onClick={() => {
                setState({ rejectModal: false, remarks: "" });
              }}
              className="reject_cancel_button"
            >
              Cancel
            </div>
            <div onClick={() => handleStatus(state.driver_id, DRIVER_STATUS.REJECTED)} className="reject_button">
              Save
            </div>
          </div>
        </div>
      </CustomModal>
      {/* reject modal end */}

      {/* approve modal */}
      <CustomModal
        center
        open={state.approvalModal}
        classNames={{ modalContainer: "delete_modal_container" }}
        onClose={() => setState({ approvalModal: false, remarks: "" })}
      >
        <div className="reject_modal_container">
          <div className="reject_heading">Reason for approval</div>
          <div className="rejection_document_wrapper">
            <TextareaComponent placeholder="Enter approval reasons" value={state.remarks} onChange={(remarks: any) => setState({ remarks })} />
          </div>
          <div className="reject_modal_button">
            <div
              onClick={() => {
                setState({ approvalModal: false, remarks: "" });
              }}
              className="reject_cancel_button"
            >
              Cancel
            </div>
            <div onClick={() => handleStatus(state.driver_id, DRIVER_STATUS.APPROVED)} className="reject_button">
              Save
            </div>
          </div>
        </div>
      </CustomModal>
      {/* approve modal end */}
    </div>
  );
}
