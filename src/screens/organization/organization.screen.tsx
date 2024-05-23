import React, { useEffect } from "react";
import { useSetState, toastifyError } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import "./organization.screen.scss";
import "react-responsive-modal/styles.css";
import DeletePopup from "components/delete_popup/delete_popup.component";
import Table from "components/table/table.component";
import Button from "common_components/ui/button/button.ui";
import Search from "common_components/ui/search/search.ui";
import Assets from "imports/assets.import";
import CustomModal from "common_components/ui/modal/modal.component";
import { useNavigate } from "react-router-dom";
import { setOrganization } from "utils/redux.utils";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import moment from "moment";
import _ from "lodash";
import { autoRefreshTime } from "utils/constant.utils";
import DateRangePicker from "common_components/ui/date_range_picker/date_range.component";

export default function Organization() {
  const navigate = useNavigate();

  // ref
  const exportOrganizationRef: any = React.useRef<{ link: HTMLAnchorElement }>(null);

  // localstorage
  let city: any = localStorage.getItem("city");
  city = JSON.parse(city);

  //redux

  //state
  const [state, setState] = useSetState({
    data: [
      {
        name: "Tech Corp",
        gst: "123456789",
        city: {
          city_name: "New York",
        },
        price_per_order: 50,
        price_over_order: 100,
      },
      {
        name: "Retail Hub",
        gst: "987654321",
        city: {
          city_name: "Los Angeles",
        },
        price_per_order: 75,
        price_over_order: 150,
      },
      {
        name: "Auto Works",
        gst: "1122334455",
        city: {
          city_name: "Chicago",
        },
        price_per_order: 60,
        price_over_order: 120,
      },
      {
        name: "Build It",
        gst: "5566778899",
        city: {
          city_name: "Houston",
        },
        price_per_order: 80,
        price_over_order: 160,
      },
    ],
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
    exportOrganizationData: "",
  });

  const thead = [
    { head: "Organization", key: "name" },
    { head: "GSTIN", key: "gst" },
    { head: "City", key: "city.city_name", isNested: true },
    { head: "Price per order", key: "price_per_order" },
    { head: "Price over order", key: "price_over_order" },
  ];

  const excelHeaders = [
    { label: "Organization name", key: "name" },
    { label: "Type", key: "type" },
    { label: "City", key: "city.city_name" },
    { label: "Category", key: "category" },
    { label: "Contract start date", key: "contract_start_date" },
    { label: "Contract end date", key: "contract_end_date" },
    { label: "GSTIN", key: "gst" },
    { label: "Minimum guarentee", key: "minimum_guarentee" },
    { label: "Price per order", key: "driver_price_per_order" },
    { label: "Price over order", key: "driver_price_over_order" },
    { label: "Driver minimum guarentee", key: "driver_minimum_guarentee" },
    { label: "Driver price per order", key: "driver_price_per_order" },
    { label: "Driver price over order", key: "driver_price_over_order" },
    { label: "Cancel booking permission", key: "cancel_booking_permission" },
  ];

  // hooks
  useEffect(() => {
    GetManyData(true);
  }, [state.search]);

  const GetManyData = async (reset = false) => {
    let res: any;
    const limit = state.limit;
    const skip = reset ? 0 : state.data.length;
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
    try {
      if (typeof state.dateRange[0] !== "string" || typeof state.dateRange[1] !== "string") {
        delete body["limit"];
        // res = await Models.organization.getManyOrganization(body);
        // setState({ data: res.data.docs, totalDocs: res.data.docs.length });
      } else {
        // res = await Models.organization.getManyOrganization(body);
        // const data = res?.data?.docs;
        if (reset) {
          // setState({ data, loading: false, totalDocs: res.data.totalDocs, skip });
        } else {
          // setState({ data: [...state.data, ...data], loading: false, totalDocs: res.data.totalDocs, skip });
        }
      }
      // setState({ refreshLimit: res.data.docs.length });
    } catch (error) {
      setState({ loading: false });
      console.log(error);
      toastifyError(error);
    }
  };

  const DeleteOrganization = async () => {
    console.log("handle deleted");
    try {
      await Models.organization.deleteOrganization({
        organization_id: state.id,
      });
      setState({ id: "", deleteModal: false });
      GetManyData(true);
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleView = data => {
    setOrganization(data);
    navigate(`/view_organization/${data?._id}`);
  };
  const handleEdit = data => {
    setOrganization(data);
    navigate(`/edit_organization/${data._id}`);
  };
  const handleDelete = data => {
    setState({ id: data._id, deleteModal: true });
  };
  const navigateToStore = data => {
    setOrganization(data);
    navigate(`/organization/${data._id}/store`);
  };

  const exportExcelData = async () => {
    const data = _.cloneDeep(state.data);
    let array: any[] = [];
    data.map(item => {
      const body = {
        ...item,
        contract_end_date: moment(item.contract_end_date).format("YYYY/MM/DD, h:mm:ss a"),
        contract_start_date: moment(item.contract_start_date).format("YYYY/MM/DD, h:mm:ss a"),
      };
      array.push(body);
    });

    const exportOrganizationData: any = {
      data: data,
      headers: excelHeaders,
      filename: "Organization.csv",
    };
    setState({ exportOrganizationData });
    setTimeout(() => {
      exportOrganizationRef?.current?.link?.click();
    }, 400);
  };

  const filterData = async () => {
    try {
      let res: any;
      const body: any = {
        limit: state.limit,
        skip: 0,
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
        // res = await Models.organization.getManyOrganization(body);
        // setState({ data: res.data.docs, totalDocs: res.data.docs.length });
      } else {
        // res = await Models.organization.getManyOrganization(body);
        // setState({ data: res.data.docs, totalDocs: res.data.totalDocs });
      }
    } catch (err: any) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    filterData();
  }, [state.dateRange]);

  return (
    <div className="container">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="head h5">Organization</div>
          <div className="search_wrapper">
            <Search value={state.search} onChange={search => setState({ search })} />
            <Button
              value="Add Organization"
              onClick={() => {
                navigate("/add_organization");
              }}
            />
            <Button value="Export" onClick={() => exportExcelData()} />
          </div>
        </div>
      </div>
      <div className="org_filter_container">
        <div className="org_filter_heading">Filter options</div>
        <div className="org_filter_dropdown_wrapper">
          <div className="org_filter_dropdown_item">
            <DateRangePicker value={state.dateRange} onChange={(dateRange: any) => setState({ dateRange })} />
          </div>
        </div>
      </div>
      <div className="list_wrapper">
        <Table
          data={state.data}
          loading={state.loading}
          totalDocs={state.totalDocs}
          loadMore={() => {}}
          theads={thead}
          link="organization"
          actions={[
            {
              icon: "store",
              onClick: navigateToStore,
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
          ]}
          // loadMore={() => GetManyData()}
          imageKey="logo"
        />
      </div>
      <CustomModal
        center
        open={state.deleteModal}
        classNames={{ modalContainer: "delete_modal_container" }}
        onClose={() => setState({ deleteModal: false })}
      >
        <DeletePopup onPress={DeleteOrganization} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>

      {state.exportOrganizationData ? (
        <>
          <CSVLink ref={exportOrganizationRef} {...state.exportOrganizationData} />
        </>
      ) : null}
    </div>
  );
}
