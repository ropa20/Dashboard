import React, { useEffect } from "react";
import { useSetState, toastifyError } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import "./hub.screen.scss";
import "react-responsive-modal/styles.css";
import DeletePopup from "components/delete_popup/delete_popup.component";
import Table from "components/table/table.component";
import Button from "common_components/ui/button/button.ui";
import Search from "common_components/ui/search/search.ui";
import CustomModal from "common_components/ui/modal/modal.component";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import moment from "moment";
import _ from "lodash";
import { autoRefreshTime } from "utils/constant.utils";
import DateRangePicker from "common_components/ui/date_range_picker/date_range.component";

export default function Hub() {
  const navigate = useNavigate();

  // ref
  const exportHubRef: any = React.useRef<{ link: HTMLAnchorElement }>(null);

  let city: any = localStorage.getItem("city");
  city = JSON.parse(city);

  //redux

  //state
  const [state, setState] = useSetState({
    data: [],
    search: "",
    openModal: false,
    viewModal: false,
    deleteModal: false,
    loading: true,
    timeout: 0,
    refreshLimit: 20,
    limit: 20,
    excelData: [],
    isOpenModel: false,
    start_date: "",
    end_date: "",
    export: false,
    exportLoader: false,
    dateRange: ["", ""],
    exportHubData: "",
  });

  const thead = [
    { head: "Name", key: "name" },
    { head: "Address", key: "address.address", isNested: true },
    { head: "Total chargers", key: "total_chargers" },
    { head: "Available chargers", key: "available_chargers" },
    { head: "2W vehicles", key: "two_wheeler_count" },
    { head: "3W vehicles", key: "three_wheeler_count" },
    { head: "Total vehicles", key: "total_vehicles" },
    { head: "Available vehicles", key: "available_vehicles" },
  ];

  const excelHeaders = [
    { label: " Hub name", key: "name" },
    { label: "Address", key: "address" },
    { label: "Total chargers", key: "total_chargers" },
    { label: "Available charger", key: "available_chargers" },
    { label: "Total vehicles", key: "total_vehicles" },
    { label: "Available vehicles", key: "available_vehicles" },
  ];

  // // hooks
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

  //network req
  const GetManyRefresh = async () => {
    try {
      let res: any;
      const limit = state.refreshLimit;
      const skip = 0;
      const body: any = {
        search: state.search,
        limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (typeof state.dateRange[0] !== "string" || typeof state.dateRange[1] !== "string") {
        delete body["limit"];
        res = await Models.hub.getManyHub(body);
        setState({ data: res?.data?.docs, totalDocs: res.data.docs.length, loading: false, skip });
      } else {
        res = await Models.hub.getManyHub(body);
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
        limit: limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (typeof state.dateRange[0] !== "string" || typeof state.dateRange[1] !== "string") {
        delete body["limit"];
        res = await Models.hub.getManyHub(body);
        setState({ data: res?.data?.docs, totalDocs: res.data.docs.length, loading: false, skip });
      } else {
        res = await Models.hub.getManyHub(body);
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
      const res: any = await Models.hub.getManyHub(body);
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

  const DeleteHub = async () => {
    try {
      await Models.hub.deleteHub({
        hub_id: state.id,
      });
      setState({ id: "", deleteModal: false });
      // GetManyData(true);
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleView = data => {
    navigate(`/view_hub/${data?._id}`);
  };
  const handleEdit = data => {
    navigate(`/edit_hub/${data._id}`);
  };
  const handleDelete = data => {
    setState({ id: data._id, deleteModal: true });
  };

  const exportExcelData = async () => {
    const data = _.cloneDeep(state.data);
    for (let i = 0; i < data.length; i++) {
      data[i].address = data[i]?.address
        ? `${data[i].address.name} , ${data[i].address.phone} , ${data[i].address.address} , ${data[i].address.city} , ${data[i].address.pincode}`
        : "";
    }

    const exportHubData: any = {
      data: data,
      headers: excelHeaders,
      filename: "Hub.csv",
    };
    setState({ exportHubData });
    setTimeout(() => {
      exportHubRef?.current?.link?.click();
    }, 400);
  };

  const filterData = async reset => {
    try {
      let res: any;
      if (reset) {
        setState({ loading: true, data: [] });
      }
      const skip = reset ? 0 : state.data.length;
      const limit = state.limit;
      const body: any = {
        search: state.search,
        limit: limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (typeof state.dateRange[0] !== "string" || typeof state.dateRange[1] !== "string") {
        delete body["limit"];
        res = await Models.hub.getManyHub(body);
        setState({ data: res?.data?.docs, totalDocs: res.data.docs.length, loading: false, skip });
      } else {
        res = await Models.hub.getManyHub(body);
        setState({ data: res?.data?.docs, totalDocs: res.data.totalDocs, loading: false, skip });
      }
    } catch (err: any) {
      console.log("err", err);
    }
  };

  // useEffect(() => {
  //   filterData(true);
  // }, [state.dateRange]);

  return (
    <div className="hub_screen">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="head h5">Hub</div>
          <div className="search_wrapper">
            <Search value={state.search} onChange={search => setState({ search })} />
            <Button
              value="Add Hub"
              onClick={() => {
                navigate("/add_hub");
              }}
            />
            <Button value="Export" onClick={() => exportExcelData()} />
          </div>
        </div>
      </div>
      <div className="hub_filter_container">
        <div className="hub_filter_heading">Filter options</div>
        <div className="hub_filter_dropdown_wrapper">
          <div className="hub_filter_dropdown_item">
            <DateRangePicker value={state.dateRange} onChange={(dateRange: any) => setState({ dateRange })} />
          </div>
        </div>
      </div>
      <div className="hubtable">
        <Table
          data={state.data}
          loading={state.loading}
          theads={thead}
          link="hub"
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
              icon: "delete",
              onClick: handleDelete,
            },
          ]}
          totalDocs={state.totalDocs}
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
        <DeletePopup onPress={DeleteHub} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>

      {state.exportHubData ? (
        <>
          <CSVLink ref={exportHubRef} {...state.exportHubData} />
        </>
      ) : null}
    </div>
  );
}
