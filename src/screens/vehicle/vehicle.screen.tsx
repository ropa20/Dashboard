import React, { useEffect, useRef } from "react";
import { useSetState, toastifyError, printDiv, vehicleApiCall } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import "react-responsive-modal/styles.css";
import DeletePopup from "components/delete_popup/delete_popup.component";
import Table from "components/table/table.component";
import Button from "common_components/ui/button/button.ui";
import Search from "common_components/ui/search/search.ui";
import CustomModal from "common_components/ui/modal/modal.component";
import { useNavigate } from "react-router-dom";
import "./vehicle.screen.scss";
import QRCodeComponent from "components/qr_code/qr_code.component";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import moment from "moment";
import { autoRefreshTime } from "utils/constant.utils";
import _ from "lodash";
import DateRangePicker from "common_components/ui/date_range_picker/date_range.component";
import SelectDropdown from "common_components/ui/select_dropdown/select_dropdown.component";
import { VehicleType } from "constants/user.constant";

export default function Vehicle() {
  const navigate = useNavigate();
  let city: any = localStorage.getItem("city");
  city = JSON.parse(city);
  //redux

  //Ref
  const componentRef = useRef(null);
  const exportVehicleRef: any = React.useRef<{ link: HTMLAnchorElement }>(null);

  //state
  const [state, setState] = useSetState({
    data: [],
    search: "",
    openModal: false,
    viewModal: false,
    deleteModal: false,
    loading: true,
    limit: 20,
    qrcode: false,
    vehicle_id: "",
    timeout: 0,
    refreshLimit: 20,
    excelData: [],
    isOpenModel: false,
    start_date: "",
    end_date: "",
    export: false,
    exportLoader: false,
    filterModel: "",
    filterEvType: "",
    modelData: [],
    dateRange: ["", ""],
    exportVehicleData: "",
  });

  const thead = [
    { head: "Created at", key: "created_at", type: "date" },
    { head: "Model", key: "model" },
    { head: "City", key: "city.city_name", isNested: true },
    { head: "Number", key: "number" },
    { head: "EV Type", key: "type" },
    // { head: 'Charge', key: 'charge_percentage' },
    { head: "Total kms", key: "total_kms" },
    // { head: 'Vehicle Status', key: 'vehicle_status' },
  ];

  const excelHeaders = [
    { label: "Model", key: "model" },
    { label: "Number", key: "number" },
    { label: "City", key: "city.city_name" },
    { label: "EV Type", key: "type" },
    { label: "Total kms", key: "total_kms" },
    { label: "Created at", key: "created_at" },
    // { label: "Vehicle Status", key: "Vehicle_status" },
  ];

  // hooks
  // useEffect(() => {
  //   GetManyData(true);
  // }, [state.search]);

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     setState({ timeout: Math.random() });
  //   }, autoRefreshTime);
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   GetManyRefresh();
  // }, [state.timeout]);

  // useEffect(()=>{
  //  getVehicle()
  // },[])

  //network req
  const GetManyRefresh = async (reset = false) => {
    try {
      let res: any;
      const skip = 0;
      const limit = state.refreshLimit;
      const body: any = {
        search: state.search,
        limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }

      if (state.filterEvType.length) {
        body["filterEvType"] = state.filterEvType;
      }
      if (state.filterModel.length) {
        body["filterModel"] = state.filterModel;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (vehicleApiCall(state.dateRange[0], state.dateRange[1], state.filterModel, state.filterEvType)) {
        delete body["limit"];
        setState({ skip: 0 });
        res = await Models.vehicle.getManyVehicle(body);
        setState({ data: res.data.docs, loading: false, totalDocs: res.data.docs.length });
      } else {
        res = await Models.vehicle.getManyVehicle(body);
        setState({ data: res?.data?.docs, totalDocs: res.data.totalDocs, skip });
      }
    } catch (error) {
      console.log(error);
      toastifyError(error);
    }
  };
  const GetManyData = async (reset = false) => {
    try {
      if (reset) {
        setState({ loading: true, data: [] });
      }
      let res: any;
      const skip = reset ? 0 : state.data.length;
      const limit = state.limit;
      const body: any = {
        search: state.search,
        limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }

      if (state.filterEvType.length) {
        body["filterEvType"] = state.filterEvType;
      }
      if (state.filterModel.length) {
        body["filterModel"] = state.filterModel;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (vehicleApiCall(state.dateRange[0], state.dateRange[1], state.filterModel, state.filterEvType)) {
        delete body["limit"];
        setState({ skip: 0 });
        res = await Models.vehicle.getManyVehicle(body);
        setState({ data: res.data.docs, loading: false, totalDocs: res.data.docs.length });
      } else {
        res = await Models.vehicle.getManyVehicle(body);
        if (reset) {
          setState({ data: res?.data?.docs, totalDocs: res.data.totalDocs, loading: false, skip });
        } else {
          setState({ data: [...state.data, ...res?.data?.docs], totalDocs: res.data.totalDocs, loading: false, skip });
        }
      }
      setState({ refreshLimit: res.data.docs.length });
    } catch (error) {
      setState({ loading: false });
      console.log(error);
      toastifyError(error);
    }
  };
  const loadMore = async (reset = false) => {
    try {
      if (reset) {
        setState({ loading: true, data: [] });
      }
      const skip = state.limit;
      const body: any = {
        search: state.search,
        limit: state.limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      const res: any = await Models.vehicle.getManyVehicle(body);
      if (reset) {
        setState({ data: res?.data?.docs, totalDocs: res.data.totalDocs, loading: false, skip });
      } else {
        setState({ data: [...state.data, ...res?.data?.docs], totalDocs: res.data.totalDocs, loading: false, skip });
      }
      setState({ refreshLimit: state.refreshLimit + state.limit });
    } catch (error) {
      setState({ loading: false });
      console.log(error);
      toastifyError(error);
    }
  };

  const DeleteVehicle = async () => {
    try {
      await Models.vehicle.deleteVehicle({
        vehicle_id: state.id,
      });
      setState({ id: "", deleteModal: false });
      // GetManyData(true);
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleView = data => {
    navigate(`/vehicle/view_vehicle/${data?._id}`);
  };
  const handleEdit = data => {
    navigate(`/edit_vehicle/${data._id}`);
  };
  const handleQRCode = data => {
    setState({ vehicle_id: data._id, qrcode: true });
  };
  const handleDelete = data => {
    setState({ id: data._id, deleteModal: true });
  };

  const exportExcelData = async () => {
    const data = _.cloneDeep(state.data);
    for (let i = 0; i < data.length; i++) {
      data[i].created_at = moment(data[i].created_at).format("YYYY/MM/DD, h:mm:ss a");
    }
    const exportVehicleData = {
      data: data,
      headers: excelHeaders,
      filename: "Vehicle.csv",
    };
    setState({ exportVehicleData });
    setTimeout(() => {
      exportVehicleRef?.current?.link?.click();
    }, 400);
  };

  const getVehicle = async () => {
    try {
      let data: any = [];
      const res: any = await Models.vehicle.getAllVehicle({});
      for (let vehicle of res.data.docs) {
        data.push({
          label: vehicle.model.toUpperCase(),
          value: vehicle.model,
        });
      }
      data = _.orderBy(data, ["label"]);
      data.unshift({
        label: "ALL MODELS",
        value: "all_models",
      });
      setState({ modelData: data });
    } catch (err: any) {
      console.log("err", err);
    }
  };

  const filterData = async reset => {
    try {
      let res: any;
      const skip = reset ? 0 : state.data.length;
      const body: any = {
        search: state.search,
        limit: state.limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (state.filterEvType.length) {
        body["filterEvType"] = state.filterEvType;
      }
      if (state.filterModel.length) {
        body["filterModel"] = state.filterModel;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (vehicleApiCall(state.dateRange[0], state.dateRange[1], state.filterModel, state.filterEvType)) {
        delete body["limit"];
        setState({ skip: 0 });
        res = await Models.vehicle.getManyVehicle(body);
        setState({ data: res.data.docs, loading: false, totalDocs: res.data.docs.length });
      } else {
        res = await Models.vehicle.getManyVehicle(body);
        setState({ data: res.data.docs, loading: false, totalDocs: res.data.totalDocs, skip });
      }
    } catch (err: any) {
      console.log("err", err);
    }
  };

  // useEffect(() => {
  //   filterData(true);
  // }, [state.filterModel, state.filterEvType, state.dateRange[0], state.dateRange[1]]);

  return (
    <div className="vehicle_screen">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="head h5">Vehicle</div>
          <div className="search_wrapper">
            <Search value={state.search} onChange={search => setState({ search })} />
            <Button
              value="Add Vehicle"
              onClick={() => {
                navigate("/add_vehicle");
              }}
            />
            <Button value="Export" onClick={() => exportExcelData()} />
          </div>
        </div>
      </div>
      <div className="vehicle_filter_container">
        <div className="vehicle_filter_heading">Filter options</div>
        <div className="vehicle_filter_dropdown_wrapper">
          <div className="vehicle_filter_dropdown_item">
            <DateRangePicker value={state.dateRange} onChange={(dateRange: any) => setState({ dateRange })} />
          </div>
          <div className="vehicle_filter_dropdown_item">
            <SelectDropdown
              notfound={"No vehicle model found"}
              placeholder="Select a model"
              data={state.modelData}
              onChange={(filterModel: any) => setState({ filterModel: filterModel.value })}
              value={state.filterModel}
            />
          </div>
          <div className="vehicle_filter_dropdown_item">
            <SelectDropdown
              notfound={"No Ev type  found"}
              placeholder={"Select a ev type"}
              data={VehicleType}
              onChange={(filterEvType: any) => setState({ filterEvType: filterEvType.value })}
              value={state.filterEvType}
            />
          </div>
        </div>
      </div>
      <div className="vehicletable">
        <Table
          data={state.data}
          loading={state.loading}
          totalDocs={state.totalDocs}
          theads={thead}
          link="vehicle"
          actions={[
            {
              icon: "view",
              onClick: handleView,
            },
            {
              icon: "edit",
              onClick: handleEdit,
            },
            {
              icon: "qrcode",
              onClick: handleQRCode,
            },
            {
              icon: "delete",
              onClick: handleDelete,
            },
          ]}
          loadMore={() => loadMore()}
          imageKey="logo"
        />
      </div>
      <CustomModal
        center
        open={state.deleteModal}
        classNames={{ modalContainer: "delete_modal_container" }}
        onClose={() => setState({ deleteModal: false })}
      >
        <DeletePopup onPress={DeleteVehicle} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>
      <CustomModal center open={state.qrcode} classNames={{ modalContainer: "delete_modal_container" }} onClose={() => setState({ qrcode: false })}>
        <QRCodeComponent ref={componentRef} text={state.vehicle_id?.toString()} />
        <div className="button_container">
          <Button
            onClick={() => {
              setState({ qrcode: false });
              window.print();
            }}
            buttonType="button"
            value="Print"
          />
        </div>
      </CustomModal>

      {state.exportVehicleData ? (
        <>
          <CSVLink ref={exportVehicleRef} {...state.exportVehicleData} />
        </>
      ) : null}
    </div>
  );
}
