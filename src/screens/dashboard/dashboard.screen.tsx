import React, { useEffect } from "react";
import ListComponent from "components/list/list.component";
import { useSetState } from "utils/functions.utils";
import "./dashboard.scss";
import "react-responsive-modal/styles.css";
import Chart from "components/chart/chart.component";
import { Models } from "utils/imports.utils";
import { autoRefreshTime } from "utils/constant.utils";
import _ from "lodash";
import { ROLES } from "constants/user.constant";

interface IUserDetails {
  email: string;
  name: string;
}

export default function Dashboard() {
  // localStorage
  let city: any = localStorage.getItem("city");
  city = JSON.parse(city);

  //state
  const [state, setState] = useSetState({
    data: [],
    search: "",
    openModal: false,
    viewModal: false,
    deleteModal: false,
    loading: false,
    heads: {
      bookings: { head: "Bookings", value: "0" },
      organizations: { head: "Organizations", value: "0" },
      stores: { head: "Stores", value: "0" },
      vehicles: { head: "Vehicles", value: "0" },
      drivers: { head: "Drivers", value: "0" },
      hubs: { head: "Hubs", value: "0" },
    },
    booking_chart: {
      keys: [],
      values: [],
    },
    driver_chart: {
      keys: [],
      values: [],
    },
    timeout: 0,
  });
  useEffect(() => {
    dashboard();
  }, []);

  const dashboard = async () => {
    try {
      const body = {};
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      // const res: any = await Models.user.dashboard(body);
      const heads = {
        // bookings: { head: "Bookings", value: res.data.bookings },
        // drivers: { head: "Drivers", value: res.data.drivers },
        // organizations: { head: "Organizations", value: res.data.organizations },
        // stores: { head: "Stores", value: res.data.stores },
        // vehicles: { head: "Vehicles", value: res.data.vehicles },
        // hubs: { head: "Hubs", value: res.data.hubs },
      };
      setState({
        // heads: heads,
        // booking_chart: { keys: Object.keys(res.data.booking_chart_date), values: Object.values(res.data.booking_chart_date) },
        // driver_chart: { keys: Object.keys(res.data.driver_chart_date), values: Object.values(res.data.driver_chart_date) },
      });
    } catch (error) {
      setState({ loading: false });
      console.log(error);
    }
  };

  // hooks

  const color = {
    color1: "#27C69E",
    color2: "#1C7BDF",
  };

  return (
    <div className="dashboard_container">
      <div className="list_wrapper">
        <ListComponent
          data={state.data}
          loading={state.loading}
          color={"table_btn_color"}
          delete_icon_color={"delete_btn_color"}
          delete={async (id: string) => {
            setState({ id, deleteModal: true, edit: false });
          }}
          theads={Object.values(state.heads)}
          link="user"
        />
      </div>
      <div className="chart_container">
        <div className="chart">
          <div className="chart_title">Bookings</div>
          <Chart data={state.booking_chart.values} bar={true} labels={state.booking_chart.keys} height={300} width={300} colors={color} />
        </div>
        <div className="chart">
          <div className="chart_title">Drivers</div>
          <Chart data={state.driver_chart.values} bar={true} labels={state.driver_chart.keys} colors={color} height={300} width={300} />
        </div>
      </div>
    </div>
  );
}
