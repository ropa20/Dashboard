import Assets from "imports/assets.import";
import React from "react";
import { useLocation } from "react-router-dom";
import "./auth.screen.scss";
import ForgotPassword from "./forgot_password.screen";
import ResetPassword from "./reset_password.screen";
import Signup from "./signup.screen";

export default function Auth() {
  const location = useLocation();
  return (
    <div className="auth_screen">
      <div className="auth_screen_wrapper">
        <div className="auth_screen_left_container">
          <div className="app_name_container">
            {/* <img src={Assets.fullfily_logo} style={{ objectFit: "contain" }} height={180} width={500} /> */}
          </div>
        </div>
        <div className="auth_screen_right_container">
          {location.pathname === "/auth" && <Signup />}
          {location.pathname === "/auth/reset_password" && <ResetPassword />}
          {location.pathname === "/auth/forgot_password" && <ForgotPassword />}
        </div>
      </div>
    </div>
  );
}
