import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Assets from "imports/assets.import";
import "./sidebar.ui.scss";
import Functions, {
  ErrorMessage,
  toastifyError,
  useSetState,
} from "utils/functions.utils";
import { Models } from "utils/imports.utils";
import Divider from "../divider/divider.ui";
import { ROLES } from "constants/user.constant";
import _ from "lodash";
import Select, { components } from "react-select";

const Sidebar = () => {
  const navigate = useNavigate();
  const [state, setState] = useSetState({
    active: "",
    data: {},
    loading: false,
    city: [
      {
        label: "All Cities",
        value: "all_cities",
      },
    ],
    cityFilterFocus: false,
  });
  const { id } = useParams();
  const role = localStorage.getItem("role");
  const org = localStorage.getItem("org");

  useEffect(() => {
    GetUser();
    getCity();
    activeSidebar();
  }, []);

  const GetUser = async () => {
    try {
      const response: any = await Models.user.getUser({});
      setState({ data: response.data, loading: true });
    } catch (err) {
      setState({ loading: false });
      console.log("error", err);
      // toastifyError(err);
    }
  };

  const adminNavigations = [
    // {
    //   icon: 'overview',
    //   link: '/',
    //   label: 'Overview',
    // },
    {
      icon: "profile",
      link: "/profile",
      label: state.loading ? `${state.data.username}` : "Welcome",
    },
    {
      icon: "area",
      link: "/dashboard",
      label: "Dashboard",
    },
    {
      icon: "organization",
      link: "/organization",
      label: "Organization",
    },
    {
      icon: "city",
      link: "/city",
      label: "City",
    },
    // {
    //   icon: 'stores',
    //   link: '/stores',
    //   label: 'Stores',
    // },
    {
      icon: "user",
      link: "/user",
      label: "User",
    },
    {
      icon: "booking",
      link: "/booking",
      label: "Booking",
    },
    {
      icon: "driver",
      link: "/driver",
      label: "Driver",
    },
    {
      icon: "pin",
      link: "/live_location",
      label: "Live location",
    },
    {
      icon: "vehicle",
      link: "/checkin",
      label: "Checkin",
    },
    {
      icon: "vehicle",
      link: "/vehicle",
      label: "Vehicle",
    },
    {
      icon: "hub",
      link: "/hub",
      label: "Hub",
    },
    {
      icon: "outsource",
      link: "/outsource",
      label: "Outsource",
    },
    {
      icon: "payout",
      link: "/payout",
      label: "Payout",
    },
    // _NAV_ ̰
  ];

  const orgAdminNavigations = [
    // {
    //   icon: 'overview',
    //   link: '/',
    //   label: 'Overview',
    // },
    {
      icon: "profile",
      link: "/profile",
      label: state.loading ? `${state.data.username}` : "Welcome",
    },
    {
      icon: "store",
      link: `/organization/${org}/store`,
      label: "Store",
    },
    {
      icon: "booking",
      link: "/booking",
      label: "Booking",
    },
    {
      icon: "user",
      link: "/user",
      label: "User",
    },
    // _NAV_ ̰
  ];

  const storeAdminNavigations = [
    // {
    //   icon: 'overview',
    //   link: '/',
    //   label: 'Overview',
    // },
    {
      icon: "profile",
      link: "/profile",
      label: state.loading ? `${state.data.username}` : "Welcome",
    },
    {
      icon: "booking",
      link: "/booking",
      label: "Booking",
    },
    {
      icon: "pin",
      link: "/live_location",
      label: "Live location",
    },
    // _NAV_ ̰
  ];

  const hubInchargeNavigations = [
    // {
    //   icon: 'overview',
    //   link: '/',
    //   label: 'Overview',
    // },
    {
      icon: "profile",
      link: "/profile",
      label: state.loading ? `${state.data.username}` : "Welcome",
    },
    {
      icon: "hub",
      link: "/hub",
      label: "Hub",
    },
    // _NAV_ ̰
  ];

  const handleLogout = async () => {
    try {
      // await Models.user.logoutUser();
      window.location.href = "/auth";
    } catch (err) {}
  };

  // city
  const getCity = async () => {
    let city_array: any = [];
    try {
      const body = {
        search: state.search,
        limit: state.limit,
      };
      const res: any = await Models.city.getCityWithoutPagination(body);
      for (let city of res.data) {
        city_array.push({
          label: city.city_name,
          value: city._id,
        });
      }
      city_array.unshift({
        label: "All Cities",
        value: "all_cities",
      });
      setState({ city: city_array });
    } catch (err: any) {
      console.log(err);
    }
  };

  // checkLocalStorage city is there or not
  const handleLocalStorage = () => {
    let city: any = localStorage.getItem("city");
    city = JSON.parse(city);
    if (_.isEmpty(city)) {
      return state.city;
    } else {
      return city;
    }
  };

  const handleFilter = (e: any) => {
    localStorage.setItem("city", JSON.stringify(e));
    window.location.reload();
  };

  const activeSidebar = () => {
    let pathname: any = window.location.pathname.split("/").pop();
    pathname = Functions.capitalizeFirstLetter(pathname);
    setState({ active: pathname });
  };

  const NoOptionsMessage = (props: any) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span>No city found</span>
      </components.NoOptionsMessage>
    );
  };

  return (
    <div className="sidebar_container">
      <div className="sidebar_wrapper">
        <div className="app_logo_caontainer">
          {/* <img src={Assets.fullfily} className="app_logo_image" alt="app_logo" /> */}
        </div>
        <div className="sidebar_item_sroll">
          <div className="sidebar_city_filter_wrapper">
            <div>
              <img src={Assets.filter_city} alt="filter_icon" />
            </div>
            <div className="city_filter">
              <Select
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 5,
                  colors: {
                    ...theme.colors,
                    primary: "#734F96",
                    primary25: "#FFFFFF",
                    primary50: "#FFFFFF",
                  },
                })}
                styles={{
                  control: (baseStyle, state) => ({
                    ...baseStyle,
                    outline: "none",
                    border: state.isFocused ? "1px solid #734F96" : "none",
                    cursor: "pointer",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }),
                }}
                onChange={(e: any) => handleFilter(e)}
                components={{ NoOptionsMessage }}
                options={state.city}
                defaultValue={handleLocalStorage}
              />
            </div>
          </div>
          <div className="city_filter_divider"></div>
          {adminNavigations.map((nav) => {
            return (
              <>
                <div
                  className={`sidebar_item_container ${
                    nav.label === state.active ? "active" : ""
                  }`}
                  onClick={() => {
                    navigate(nav.link); // Use semicolon instead of comma
                    setState({ active: nav.label });
                  }}
                >
                  <div className="sidebar_item_wrapper">
                    <div className="sidebar_icon_container">
                      <img
                        src={Assets[nav.icon]}
                        width={22}
                        height={22}
                        className="sidebar_icon"
                        alt="view"
                      />
                    </div>
                    <div className="sidebar_label_container">
                      <div className="sidebar_label">{nav.label}</div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
          <Divider />
          <div
            className={`sidebar_item_container`}
            onClick={() => {
              handleLogout();
            }}
          >
            <div className="sidebar_item_wrapper">
              <div className="sidebar_icon_container">
                <img
                  src={Assets.logout}
                  width={25}
                  height={25}
                  className="sidebar_icon"
                  alt="view"
                />
              </div>
              <div className="sidebar_label_container">
                <div className="sidebar_label">Logout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
