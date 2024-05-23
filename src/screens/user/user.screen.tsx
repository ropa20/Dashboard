import React, { useEffect } from "react";
import { useSetState, toastifyError } from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import "./user.screen.scss";
import "react-responsive-modal/styles.css";
import DeletePopup from "components/delete_popup/delete_popup.component";
import Table from "components/table/table.component";
import Button from "common_components/ui/button/button.ui";
import Search from "common_components/ui/search/search.ui";
import CustomModal from "common_components/ui/modal/modal.component";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import moment from "moment";
import DatePicker from "react-datepicker";
import _ from "lodash";
import { autoRefreshTime } from "utils/constant.utils";
import DateRangePicker from "common_components/ui/date_range_picker/date_range.component";

export default function User() {
  const navigate = useNavigate();

  // ref
  const exportUserRef: any = React.useRef<{ link: HTMLAnchorElement }>(null);

  const org = localStorage.getItem("org");
  let city: any = localStorage.getItem("city");
  city = JSON.parse(city);
  //redux

  //state
  const [state, setState] = useSetState({
    data: [
      {
        username: "jdoe",
        email: "jdoe@example.com",
        city: {
          city_name: "New York",
        },
        organization: {
          name: "Tech Corp",
        },
        store: {
          name: "Tech Store",
        },
        role: "Manager",
        phone: "123-456-7890",
      },
      {
        username: "asmith",
        email: "asmith@example.com",
        city: {
          city_name: "Los Angeles",
        },
        organization: {
          name: "Retail Hub",
        },
        store: {
          name: "Retail Outlet",
        },
        role: "Sales Associate",
        phone: "098-765-4321",
      },
      {
        username: "mjones",
        email: "mjones@example.com",
        city: {
          city_name: "Chicago",
        },
        organization: {
          name: "Auto Works",
        },
        store: {
          name: "Auto Parts",
        },
        role: "Technician",
        phone: "555-123-4567",
      },
      {
        username: "klee",
        email: "klee@example.com",
        city: {
          city_name: "Houston",
        },
        organization: {
          name: "Build It",
        },
        store: {
          name: "Building Supplies",
        },
        role: "Foreman",
        phone: "444-987-6543",
      },
    ],
    search: "",
    openModal: false,
    viewModal: false,
    deleteModal: false,
    loading: true,
    timeout: 0,
    limit: 20,
    refreshLimit: 20,
    excelData: [],
    isOpenModel: false,
    start_date: "",
    end_date: "",
    export: false,
    exportLoader: false,
    dateRange: ["", ""],
    exportUserData: "",
  });

  const thead = [
    { head: "Username", key: "username" },
    { head: "Email", key: "email" },
    { head: "City", key: "city.city_name", isNested: true },
    { head: "Organization", key: "organization.name", isNested: true },
    { head: "Store", key: "store.name", isNested: true, width: 200 },
    { head: "Role", key: "role" },
    { head: "Phone", key: "phone" },
  ];

  const excelHeaders = [
    { label: "User name", key: "username" },
    { label: "City", key: "city.city_name" },
    { label: "Organization", key: "organization" },
    { label: "Store", key: "store" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Phone", key: "phone" },
  ];

  const csvReport = {
    data: state.excelData,
    headers: excelHeaders,
    filename: "User.csv",
  };

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

  const GetManyData = async (reset = false) => {
    try {
      let res: any;
      const skip = reset ? 0 : state.data.length;
      const limit = state.limit;

      const body: any = {
        search: state.search,
        limit: limit,
        skip,
      };
      if (!_.isEmpty(city)) {
        body.city = city.value;
      }
      if (org) {
        body.org = org;
      }
      if (typeof state.dateRange[0] !== "string") {
        body["date_range_start"] = moment(state.dateRange[0]).startOf("day").toString();
      }
      if (typeof state.dateRange[1] !== "string") {
        body["date_range_end"] = moment(state.dateRange[1]).endOf("day").toString();
      }

      if (typeof state.dateRange[0] !== "string" || typeof state.dateRange[1] !== "string") {
        delete body["limit"];
        // res = await Models.user.getUserList(body);
        // setState({ data: res?.data?.docs, totalDocs: res.data.docs.length, loading: false, skip });
      } else {
        // res = await Models.user.getUserList(body);
        if (reset) {
          // setState({ data: res?.data?.docs, totalDocs: res.data.totalDocs, loading: false, skip });
        } else {
          // setState({ data: [...state.data, ...res?.data?.docs], totalDocs: res.data.totalDocs, loading: false, skip });
        }
      }
      // setState({ refreshLimit: res.data.docs.length });
    } catch (error) {
      console.log(error);
      setState({ loading: false });
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

      if (org) {
        body.org = org;
      }
      const res: any = await Models.user.getUserList(body);
      if (reset) {
        setState({ data: res?.data?.docs, totalDocs: res.data.totalDocs, loading: false, skip });
      } else {
        setState({ data: [...state.data, ...res?.data?.docs], totalDocs: res.data.totalDocs, loading: false, skip });
      }
      setState({ refreshLimit: state.refreshLimit + state.limit });
    } catch (error) {
      console.log(error);
      setState({ loading: false });
      toastifyError(error);
    }
  };

  const DeleteUser = async () => {
    try {
      await Models.user.deleteUser({
        user_id: state.id,
      });
      setState({ id: "", deleteModal: false });
      GetManyData(true);
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleView = data => {
    navigate(`/view_user/${data?._id}`);
  };
  const handleEdit = data => {
    navigate(`/edit_user/${data._id}`);
  };
  const handleDelete = data => {
    setState({ id: data._id, deleteModal: true });
  };

  const exportExcelData = async () => {
    let data = _.cloneDeep(state.data);
    for (let i = 0; i < data.length; i++) {
      data[i].organization = data[i].organization?.name ? data[i].organization.name : "---";
      data[i].store = data[i].store?.name ? data[i].store.name : "--";
    }
    const exportUserData: any = {
      data: data,
      headers: excelHeaders,
      filename: "User.csv",
    };
    setState({ exportUserData });
    setTimeout(() => {
      exportUserRef?.current?.link?.click();
    }, 400);
  };

  return (
    <div className="user_screen">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="head h5">User</div>
          <div className="search_wrapper">
            <Search value={state.search} onChange={search => setState({ search })} />
            <Button
              value="Add User"
              onClick={() => {
                navigate("/add_user");
              }}
            />
            <Button value="Export" onClick={() => exportExcelData()} />
          </div>
        </div>
      </div>
      <div className="user_filter_container">
        <div className="user_filter_heading">Filter options</div>
        <div className="user_filter_dropdown_wrapper">
          <div className="user_filter_dropdown_item">
            <DateRangePicker value={state.dateRange} onChange={(dateRange: any) => setState({ dateRange })} />
          </div>
        </div>
      </div>
      <div className="usertable">
        <Table
          data={state.data}
          loading={state.loading}
          totalDocs={state.totalDocs}
          theads={thead}
          link="user"
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
        <DeletePopup onPress={DeleteUser} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>
      {state.exportUserData ? (
        <>
          <CSVLink ref={exportUserRef} {...state.exportUserData} />
        </>
      ) : null}
    </div>
  );
}
