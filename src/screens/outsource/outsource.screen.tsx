import React, { useEffect } from "react";
import { useSetState, toastifyError } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import "./outsource.screen.scss";
import "react-responsive-modal/styles.css";
import DeletePopup from "components/delete_popup/delete_popup.component";
import Table from "components/table/table.component";
import Button from "common_components/ui/button/button.ui";
import Search from "common_components/ui/search/search.ui";
import CustomModal from "common_components/ui/modal/modal.component";
import { useNavigate } from "react-router-dom";
import { Field, Formik } from "formik";
import Select from "components/select/select.component";
import { CSVLink } from "react-csv";
import moment from "moment";
import DatePicker from "react-datepicker";
import { autoRefreshTime } from "utils/constant.utils";
import _ from "lodash";
import DateRangePicker from "common_components/ui/date_range_picker/date_range.component";

export default function Outsource() {
  const navigate = useNavigate();

  // ref
  const exportOutSourceRef: any = React.useRef<{ link: HTMLAnchorElement }>(null);

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
    exportOutSourceData: "",
  });

  const thead = [
    { head: "Organization", key: "organization.name", isNested: true },
    { head: "Store", key: "store.name", isNested: true },
    { head: "City", key: "city.city_name", isNested: true },
    { head: "Driver", key: "driver.name", isNested: true },
    { head: "Start time", key: "start_time", type: "date" },
    { head: "End time", key: "end_time", type: "date" },
  ];
  const excelHeaders = [
    { label: "Organization", key: "organization.name" },
    { label: "Store", key: "store.name" },
    { label: "City", key: "city.city_name" },
    { label: "Driver", key: "driver.name" },
    { label: "Start time", key: "start_time" },
    { label: "End time", key: "end_time" },
  ];

  // hooks
  // useEffect(() => {
  //   GetManyData();
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
  const GetManyRefresh = async (store = state.store, driver = state.driver) => {
    try {
      let res: any;
      const limit = state.refreshLimit;
      const skip = 0;
      const body: any = {
        search: state.search,
        limit,
        skip,
        store,
        driver,
      };

      if (store) {
        body.store = store;
      }

      if (driver) {
        body.driver = driver;
      }

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
        res = await Models.outsource.getManyOutsource(body);
        setState({ data: res?.data?.docs, totalDocs: res.data.docs.length, loading: false, skip });
      } else {
        res = await Models.outsource.getManyOutsource(body);
        const data = res?.data?.docs;
        setState({ data, totalDocs: res.data.totalDocs, skip });
      }
    } catch (error) {
      console.log(error);
      toastifyError(error);
    }
  };

  const GetManyData = async (reset = false, store = state.store, driver = state.driver) => {
    try {
      if (reset) {
        setState({ loading: true, data: [] });
      }
      let res: any;
      const limit = state.limit;
      const skip = reset ? 0 : state.data.length;
      const body: any = {
        search: state.search,
        limit,
        skip,
        store,
        driver,
      };

      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }

      if (store) {
        body.store = store;
      }

      if (driver) {
        body.driver = driver;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (typeof state.dateRange[0] !== "string" || typeof state.dateRange[1] !== "string") {
        delete body["limit"];
        res = await Models.outsource.getManyOutsource(body);
        setState({ data: res?.data?.docs, totalDocs: res.data.docs.length, loading: false, skip });
      } else {
        res = await Models.outsource.getManyOutsource(body);
        if (reset) {
          setState({ data: res.data.docs, loading: false, totalDocs: res.data.totalDocs, skip });
        } else {
          setState({ data: [...state.data, ...res.data.docs], loading: false, totalDocs: res.data.totalDocs, skip });
        }
      }
      setState({ refreshLimit: res.data.docs.length });
    } catch (error) {
      setState({ loading: false });
      console.log(error);
      toastifyError(error);
    }
  };

  const DeleteOutsource = async () => {
    try {
      await Models.outsource.deleteOutsource({
        outsource_id: state.id,
      });
      setState({ id: "", deleteModal: false });
      // GetManyData();
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleView = data => {
    navigate(`/view_outsource/${data?._id}`);
  };
  const handleEdit = data => {
    navigate(`/edit_outsource/${data._id}`);
  };
  const handleDelete = data => {
    setState({ id: data._id, deleteModal: true });
  };

  const searchDriver = value => {
    setState({ driver: value, data: [] });
    // GetManyData(true, state.store, value);
  };

  const searchStore = value => {
    setState({ store: value, data: [] });
    // GetManyData(true, value, state.driver);
  };

  const exportExcelData = async () => {
    let data = _.cloneDeep(state.data);
    for (let i = 0; i < data.length; i++) {
      data[i].start_time = moment(data[i].start_time).format("YYYY-MM-DD HH:mm:ss a");
      data[i].end_time = moment(data[i].end_time).format("YYYY-MM-DD HH:mm:ss a");
    }

    const exportOutSourceData: any = {
      data: data,
      headers: excelHeaders,
      filename: "Outsource.csv",
    };
    setState({ exportOutSourceData });
    setTimeout(() => {
      exportOutSourceRef?.current?.link?.click();
    }, 400);
  };

  const filterData = async (reset = false, store = state.store, driver = state.driver) => {
    try {
      let res: any;
      const limit = state.limit;
      const skip = reset ? 0 : state.data.length;
      const body: any = {
        search: state.search,
        limit,
        skip,
        store,
        driver,
      };

      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }

      if (store) {
        body.store = store;
      }

      if (driver) {
        body.driver = driver;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (typeof state.dateRange[0] !== "string" || typeof state.dateRange[1] !== "string") {
        delete body["limit"];
        res = await Models.outsource.getManyOutsource(body);
        setState({ data: res.data.docs, totalDocs: res.data.docs.length, loading: false, skip });
      } else {
        res = await Models.outsource.getManyOutsource(body);
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
    <div className="outsource_screen">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="head h5">Outsource</div>
          <div className="search_wrapper">
            <div className="add_field_container">
              <Formik onSubmit={() => console.log("Submit")} initialValues={{ search: state.search }} enableReinitialize>
                <Field name={"driver"}>
                  {/* {({ field, form }) => <Select name={"driver"} onChange={searchDriver} type="driver" placeholder="Driver" value={state.search} />} */}
                </Field>
              </Formik>
            </div>
            <div className="add_field_container">
              <Formik onSubmit={() => console.log("Submit")} initialValues={{ search: state.search }} enableReinitialize>
                <Field name={"store"}>
                  {/* {({ field, form }) => <Select name={"store"} onChange={searchStore} type="store" placeholder="Store" value={state.store} />} */}
                </Field>
              </Formik>
            </div>
          </div>
          <Button
            value="Add"
            onClick={() => {
              navigate("/add_outsource");
            }}
          />
          <Button value="Export" onClick={() => exportExcelData()} />
        </div>
      </div>
      <div className="outsource_filter_container">
        <div className="outsource_filter_heading">Filter options</div>
        <div className="outsource_filter_dropdown_wrapper">
          <div className="outsource_filter_dropdown_item">
            <DateRangePicker value={state.dateRange} onChange={(dateRange: any) => setState({ dateRange })} />
          </div>
        </div>
      </div>
      <div className="outsourcetable">
        <Table
          data={state.data}
          totalDocs={state.totalDocs}
          loadMore={() => {}}
          loading={state.loading}
          theads={thead}
          link="outsource"
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
          imageKey="logo"
        />
      </div>
      <CustomModal
        center
        open={state.deleteModal}
        classNames={{ modalContainer: "delete_modal_container" }}
        onClose={() => setState({ deleteModal: false })}
      >
        <DeletePopup onPress={DeleteOutsource} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>

      {state.exportOutSourceData ? (
        <>
          <CSVLink ref={exportOutSourceRef} {...state.exportOutSourceData} />
        </>
      ) : null}
    </div>
  );
}
