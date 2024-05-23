import React, { Suspense } from "react";
import "./App.scss";
import Test from "screens/test/test.screen";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "common_components/hoc/main.hoc";
import store from "store/store";
import { Provider } from "react-redux";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "screens/dashboard/dashboard.screen";
import Login from "screens/login/login.screen";
// import ChatScreen from 'screens/chat/chat.screen';
// import Login from 'screens/login/login.screen';
// import Conversation from 'screens/chat_screen/chat.screen';
import AddOrganization from "screens/organization/add_organization.screen";
import Organization from "screens/organization/organization.screen";
import ViewOrganization from "screens/organization/view_organization.screen";
import Auth from "screens/auth/auth.screen";
import AddStore from "screens/store/add_store.screen";
import ViewStore from "screens/store/view_store.screen";
import Store from "screens/store/store.screen";
import AddUser from "screens/user/add_user.screen";
import ViewUser from "screens/user/view_user.screen";
import User from "screens/user/user.screen";
import AddVehicle from "screens/vehicle/add_vehicle.screen";
import ViewVehicle from "screens/vehicle/view_vehicle.screen";
import Vehicle from "screens/vehicle/vehicle.screen";
import AddStores from "screens/stores/add_stores.screen";
import ViewStores from "screens/stores/view_stores.screen";
import Stores from "screens/stores/stores.screen";
import AddHub from "screens/hub/add_hub.screen";
import ViewHub from "screens/hub/view_hub.screen";
import Hub from "screens/hub/hub.screen";
import AddOutsource from "screens/outsource/add_outsource.screen";
import ViewOutsource from "screens/outsource/view_outsource.screen";
import Outsource from "screens/outsource/outsource.screen";
import AddPayout from "screens/payout/add_payout.screen";
import ViewPayout from "screens/payout/view_payout.screen";
import Payout from "screens/payout/payout.screen";
import AddDriver from "screens/driver/add_driver.screen";
import ViewDriver from "screens/driver/view_driver.screen";
import Driver from "screens/driver/driver.screen";
import AddBooking from "screens/booking/add_booking.screen";
import ViewBooking from "screens/booking/view_booking.screen";
import Booking from "screens/booking/booking.screen";
import AddCheckin from "screens/checkin/add_checkin.screen";
import ViewCheckin from "screens/checkin/view_checkin.screen";
import Checkin from "screens/checkin/checkin.screen";
// import LiveLocation from './screens/location/live_location.screen';
import Profile from "./screens/profile/profile.screen";
import CityScreen from "screens/city/city.screen";

// import { useJsApiLoader } from "@react-google-maps/api";
import toast, { Toaster } from "react-hot-toast";
import ResetPasswordConfirmation from "screens/auth/reset_password_confirm.screen";
// _NSI_

const token = localStorage.getItem("token");

function App() {
  // let { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: "AIzaSyBG8SjQz30VnO_BrRL1YqQgx9dJ24NII1k",
  //   libraries: ["places"],
  // });
  return (
    <Provider store={store}>
      <ToastContainer position="top-center" transition={Slide} />
      <BrowserRouter>
        <Suspense fallback={<div />}>
          <Routes>
            <Route path="/auth" element={<Auth />}></Route>
            <Route path="/auth/reset_password" element={<Auth />}></Route>
            <Route path="/auth/forgot_password" element={<Auth />}></Route>
            <Route
              path="/auth/reset_password/:id"
              element={<ResetPasswordConfirmation />}
            ></Route>
            <Route
              path="/login"
              element={
                <Main>
                  <Login />
                </Main>
              }
            ></Route>
            <Route
              path="/test"
              element={
                <Main>
                  <Test />
                </Main>
              }
            ></Route>
            <Route
              path="/dashboard"
              element={
                <Main>
                  <Dashboard />
                </Main>
              }
            ></Route>
            <Route
              path="/"
              element={
                <Main>
                  <Dashboard />
                </Main>
              }
            ></Route>
            <Route
              path="/organization"
              element={
                <Main>
                  <Organization />
                </Main>
              }
            ></Route>
            <Route
              path="/view_organization/:id"
              element={
                <Main>
                  <ViewOrganization />
                </Main>
              }
            ></Route>
            <Route
              path="/edit_organization/:id"
              element={
                <Main>
                  <AddOrganization />
                </Main>
              }
            ></Route>
            <Route
              path="/add_organization"
              element={
                <Main>
                  <AddOrganization />
                </Main>
              }
            ></Route>
            <Route
              path="/organization/:organizationId/store"
              element={
                <Main>
                  <Store />
                </Main>
              }
            ></Route>
            <Route
              path="/organization/:organizationId/view_store/:id"
              element={
                <Main>
                  <ViewStore />
                </Main>
              }
            ></Route>
            <Route
              path="/organization/:organizationId/edit_store/:id"
              element={
                <Main>
                  <AddStore />
                </Main>
              }
            ></Route>
            <Route
              path="/organization/:organizationId/add_store"
              element={
                <Main>
                  <AddStore />
                </Main>
              }
            ></Route>
            <Route
              path="/user"
              element={
                <Main>
                  <User />
                </Main>
              }
            ></Route>
            <Route
              path="/view_user/:id"
              element={
                <Main>
                  <ViewUser />
                </Main>
              }
            ></Route>
            <Route
              path="/edit_user/:id"
              element={
                <Main>
                  <AddUser />
                </Main>
              }
            ></Route>
            <Route
              path="/add_user"
              element={
                <Main>
                  <AddUser />
                </Main>
              }
            ></Route>
            <Route
              path="/stores"
              element={
                <Main>
                  <Stores />
                </Main>
              }
            ></Route>
            <Route
              path="/view_stores/:id"
              element={
                <Main>
                  <ViewStores />
                </Main>
              }
            ></Route>
            <Route
              path="/edit_stores/:id"
              element={
                <Main>
                  <AddStores />
                </Main>
              }
            ></Route>
            <Route
              path="/add_stores"
              element={
                <Main>
                  <AddStores />
                </Main>
              }
            ></Route>
            <Route
              path="/vehicle"
              element={
                <Main>
                  <Vehicle />
                </Main>
              }
            ></Route>
            <Route
              path="/vehicle/view_vehicle/:id"
              element={
                <Main>
                  <ViewVehicle />
                </Main>
              }
            ></Route>
            <Route
              path="/edit_vehicle/:id"
              element={
                <Main>
                  <AddVehicle />
                </Main>
              }
            ></Route>
            <Route
              path="/add_vehicle"
              element={
                <Main>
                  <AddVehicle />
                </Main>
              }
            ></Route>
            <Route
              path="/hub"
              element={
                <Main>
                  <Hub />
                </Main>
              }
            ></Route>
            <Route
              path="/view_hub/:id"
              element={
                <Main>
                  <ViewHub />
                </Main>
              }
            ></Route>
            <Route
              path="/edit_hub/:id"
              element={
                <Main>
                  <AddHub />
                </Main>
              }
            ></Route>
            <Route
              path="/add_hub"
              element={
                <Main>
                  <AddHub />
                </Main>
              }
            ></Route>
            <Route
              path="/outsource"
              element={
                <Main>
                  <Outsource />
                </Main>
              }
            ></Route>
            <Route
              path="/view_outsource/:id"
              element={
                <Main>
                  <ViewOutsource />
                </Main>
              }
            ></Route>
            <Route
              path="/edit_outsource/:id"
              element={
                <Main>
                  <AddOutsource />
                </Main>
              }
            ></Route>
            <Route
              path="/add_outsource"
              element={
                <Main>
                  <AddOutsource />
                </Main>
              }
            ></Route>
            <Route
              path="/payout"
              element={
                <Main>
                  <Payout />
                </Main>
              }
            ></Route>
            <Route
              path="/view_payout/:id"
              element={
                <Main>
                  <ViewPayout />
                </Main>
              }
            ></Route>
            <Route
              path="/edit_payout/:id"
              element={
                <Main>
                  <AddPayout />
                </Main>
              }
            ></Route>
            <Route
              path="/add_payout"
              element={
                <Main>
                  <AddPayout />
                </Main>
              }
            ></Route>
            <Route
              path="/driver"
              element={
                <Main>
                  <Driver />
                </Main>
              }
            ></Route>
            <Route
              path="/view_driver/:id"
              element={
                <Main>
                  <ViewDriver />
                </Main>
              }
            ></Route>
            <Route
              path="/edit_driver/:id"
              element={
                <Main>
                  <AddDriver />
                </Main>
              }
            ></Route>
            <Route
              path="/add_driver"
              element={
                <Main>
                  <AddDriver />
                </Main>
              }
            ></Route>
            <Route
              path="/booking"
              element={
                <Main>
                  <Booking />
                </Main>
              }
            ></Route>
            <Route
              path="/view_booking/:id"
              element={
                <Main>
                  <ViewBooking />
                </Main>
              }
            ></Route>
            <Route
              path="/edit_booking/:id"
              element={
                <Main>
                  <AddBooking />
                </Main>
              }
            ></Route>
            <Route
              path="/add_booking"
              element={
                <Main>
                  <AddBooking />
                </Main>
              }
            ></Route>
            <Route
              path="/checkin"
              element={
                <Main>
                  <Checkin />
                </Main>
              }
            ></Route>
            <Route
              path="/profile"
              element={
                <Main>
                  <Profile />
                </Main>
              }
            ></Route>
            <Route
              path="/view_checkin/:id"
              element={
                <Main>
                  <ViewCheckin />
                </Main>
              }
            ></Route>
            <Route
              path="/city"
              element={
                <Main>
                  <CityScreen />
                </Main>
              }
            ></Route>
            _NR_
          </Routes>
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              className: "",
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "green",
                  secondary: "black",
                },
              },
            }}
          />
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
