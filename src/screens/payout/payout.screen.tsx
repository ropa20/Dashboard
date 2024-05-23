import React, { useEffect } from "react";
import { useSetState, useQuery, toastifyError } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import "./payout.screen.scss";
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
import DatePicker from "react-datepicker";
import moment from "moment";
import { autoRefreshTime } from "utils/constant.utils";
import DateRangePicker from "common_components/ui/date_range_picker/date_range.component";
import _ from "lodash";

export default function Payout() {
  const navigate = useNavigate();
  let city: any = localStorage.getItem("city");
  city = JSON.parse(city);

  // ref
  const exportPayoutRef: any = React.useRef<{ link: HTMLAnchorElement }>(null);

  const query = useQuery();
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
    exportPayoutData: "",
  });

  const thead = [
    { head: "Driver", key: "driver.name", isNested: true },
    { head: "City", key: "city.city_name", isNested: true },
    { head: "User", key: "user.username", isNested: true },
    { head: "Amount", key: "amount" },
    { head: "Payment type", key: "payment_type" },
    { head: "Payment ID", key: "payment_id" },
  ];

  const excelHeaders = [
    { label: "User", key: "user.username" },
    { label: "Driver", key: "driver.name" },
    { label: "City", key: "city.city_name" },
    { label: "Amount", key: "amount" },
    { label: "Payment type", key: "payment_type" },
    { label: "Payment ID", key: "payment_id" },
  ];

  // hooks
  // useEffect(() => {
  //   let search = state.search;
  //   if (!search) {
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
  // }, [state.timeout]);

  //network req
  const GetManyRefresh = async (driver = state.driver) => {
    try {
      let res: any;
      const limit = state.refreshLimit;
      const skip = 0;
      const body: any = {
        search: state.search,
        limit,
        skip,
        driver,
      };
      if (!_.isEmpty(city)) {
        body.city = city.value;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (typeof state.dateRange[0] !== "string" || typeof state.dateRange[1] !== "string") {
        delete body["limit"];
        res = await Models.payout.getManyPayout(body);
        setState({ data: res.data.docs, loading: false, totalDocs: res.data.docs.length, skip });
      } else {
        res = await Models.payout.getManyPayout(body);
        const data = res?.data?.docs;
        setState({ data, totalDocs: res.data.totalDocs, skip });
      }
    } catch (error) {
      console.log(error);
      toastifyError(error);
    }
  };

  const GetManyData = async (reset = true, driver = state.driver) => {
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
        driver,
      };
      if (!_.isEmpty(city)) {
        body.city = city.value;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (typeof state.dateRange[0] !== "string" || typeof state.dateRange[1] !== "string") {
        delete body["limit"];
        res = await Models.payout.getManyPayout(body);
        setState({ data: res.data.docs, loading: false, totalDocs: res.data.docs.length, skip });
      } else {
        res = await Models.payout.getManyPayout(body);
        const data = res?.data?.docs;
        if (reset) {
          setState({ data, loading: false, totalDocs: res.data.totalDocs, skip });
        } else {
          setState({ data: [...state.data, ...data], loading: false, totalDocs: res.data.totalDocs, skip });
        }
      }
      setState({ refreshLimit: res.data.docs.length });
    } catch (error) {
      setState({ loading: false });
      console.log(error);
      toastifyError(error);
    }
  };

  const loadMore = async (reset = false, driver = state.driver) => {
    try {
      if (reset) {
        setState({ loading: true, data: [] });
      }
      const skip = state.limit;
      const body: any = {
        search: state.search,
        limit: state.limit,
        skip,
        driver,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      const res: any = await Models.payout.getManyPayout(body);
      const data = res?.data?.docs;
      if (reset) {
        setState({ data, loading: false, totalDocs: res.data.totalDocs, skip });
      } else {
        setState({ data: [...state.data, ...data], loading: false, totalDocs: res.data.totalDocs, skip });
      }
      setState({ refreshLimit: state.refreshLimit + state.limit });
    } catch (error) {
      setState({ loading: false });
      console.log(error);
      toastifyError(error);
    }
  };

  const DeletePayout = async () => {
    try {
      await Models.payout.deletePayout({
        payout_id: state.id,
      });
      setState({ id: "", deleteModal: false });
      GetManyData(true);
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleView = data => {
    navigate(`/view_payout/${data?._id}`);
  };
  const handleEdit = data => {
    navigate(`/edit_payout/${data._id}`);
  };
  const handleDelete = data => {
    setState({ id: data._id, deleteModal: true });
  };
  const searchDriver = value => {
    setState({ driver: value, data: [] });
    GetManyData(true, value);
  };

  const exportExcelData = async () => {
    const data = _.cloneDeep(state.data);
    const exportPayoutData: any = {
      data: data,
      headers: excelHeaders,
      filename: "Payout.csv",
    };
    setState({ exportPayoutData });
    setTimeout(() => {
      exportPayoutRef?.current?.link?.click();
    }, 400);
  };

  const filterData = async (reset = false, driver = state.driver) => {
    try {
      let res: any;
      const limit = state.limit;
      const skip = reset ? 0 : state.data.length;
      const body: any = {
        limit,
        skip,
        driver,
      };
      if (!_.isEmpty(city)) {
        body.city = city.value;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }
      if (typeof state.dateRange[0] !== "string" || typeof state.dateRange[1] !== "string") {
        delete body["limit"];
        res = await Models.payout.getManyPayout(body);
        setState({ data: res.data.docs, loading: false, totalDocs: res.data.docs.length, skip });
      } else {
        res = await Models.payout.getManyPayout(body);
        setState({ data: res.data.docs, loading: false, totalDocs: res.data.totalDocs, skip });
      }
    } catch (err: any) {
      console.log("err", err);
    }
  };

  // useEffect(() => {
  //   filterData(true);
  // }, [state.dateRange]);

  return (
    <div className="payout_screen">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="head h5">Payout</div>
          <div className="search_wrapper">
            <div className="add_field_container">
              <Formik onSubmit={() => console.log("Submit")} initialValues={{ search: state.search }} enableReinitialize>
                <Field name={"driver"}>
                  {/* {({ field, form }) => <Select name={"driver"} onChange={searchDriver} \ placeholder="Driver" value={state.search} />} */}
                </Field>
              </Formik>
            </div>
          </div>
          <Button
            value="Add Payout"
            onClick={() => {
              navigate("/add_payout");
            }}
          />
          <Button value="Export" onClick={() => exportExcelData()} />
        </div>
      </div>
      <div className="payout_filter_container">
        <div className="payoyt_filter_heading">Filter options</div>
        <div className="payout_filter_dropdown_wrapper">
          <div className="payout_filter_dropdown_item">
            <DateRangePicker value={state.dateRange} onChange={(dateRange: any) => setState({ dateRange })} />
          </div>
        </div>
      </div>
      <div className="payouttable">
        <Table
          data={state.data}
          loading={state.loading}
          totalDocs={state.totalDocs}
          theads={thead}
          link="payout"
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
          loadMore={() => {}}
          imageKey="logo"
        />
      </div>
      <CustomModal
        center
        open={state.deleteModal}
        classNames={{ modalContainer: "delete_modal_container" }}
        onClose={() => setState({ deleteModal: false })}
      >
        <DeletePopup onPress={DeletePayout} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>

      {state.exportPayoutData ? (
        <>
          <CSVLink ref={exportPayoutRef} {...state.exportPayoutData} />
        </>
      ) : null}
    </div>
  );
}
