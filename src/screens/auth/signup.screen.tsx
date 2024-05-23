import { Form, Formik } from "formik";
import * as yup from "yup";
import React from "react";
import "./signup.screen.scss";
import InputField from "common_components/ui/field/field.ui";
import Button from "common_components/ui/button/button.ui";
import Divider from "common_components/ui/divider/divider.ui";
import { Link, useNavigate } from "react-router-dom";
import { Models } from "utils/imports.utils";
import { ErrorMessage, toastifyError } from "utils/functions.utils";
import { ROLES } from "constants/user.constant";

export default function Signup() {
  const validationSchema = yup.object({
    email: yup.string().required("Please enter username"),
    password: yup.string().required("Please enter password"),
  });
  const handleLogin = async values => {
    try {
      values.email = values.email.toLowerCase().trim();
      // const login: any = await Models.user.loginUser(values);
      window.location.href = "/dashboard";
    } catch (err) {
      toastifyError(err);
    }
  };
  return (
    <div className="signup_screen">
      <div className="signup_screen_wrapper">
        <div className="signup_screen_container">
          <div className="signup_head_container">
            <div className="signup_head_wrapper">
              <div className="signup_head">Login</div>
              <div className="signup_desc">Please fill your information below</div>
            </div>
          </div>
          <div className="signup_input_wrapper">
            <Formik
              onSubmit={handleLogin}
              validationSchema={validationSchema}
              initialValues={{
                email: "",
                password: "",
              }}
            >
              <Form>
                <div className="signup_input_container">
                  <InputField name="email" type="text" placeholder="Email" />
                </div>
                <div className="signup_input_container">
                  <InputField name="password" type="password" placeholder="Password" />
                </div>
                <div className="submit_button_container">
                  <Button value="Login" />
                </div>
              </Form>
            </Formik>
          </div>
          <Divider style={{ width: "100%", margin: "1em 0" }} />
          <Link to="/auth/reset_password">
            <div className="signup_links_container">
              <div className="signup_link">Forgot password?</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
