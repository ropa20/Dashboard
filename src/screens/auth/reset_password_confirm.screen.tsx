import { Form, Formik } from "formik";
import * as yup from "yup";
import React from "react";
import "./signup.screen.scss";
import InputField from "common_components/ui/field/field.ui";
import Button from "common_components/ui/button/button.ui";
import Divider from "common_components/ui/divider/divider.ui";
import { Link } from "react-router-dom";
import { useNavigate,useParams } from "react-router-dom";
import { Models, Assets } from "utils/imports.utils";
import { toastifyError } from "utils/functions.utils";

export default function ResetPasswordConfirmation() {
  const validationSchema = yup.object({
    password: yup.string().required("Please enter password"),
    confirm_password: yup.string().required("Please enter confirm password"),
  });

  // navigation
  const navigate = useNavigate();
  const {id} = useParams()


  const resetPassword = async (values: any) => {
    if (values.password !== values.confirm_password) {
      toastifyError("Confirm password must match to the password");
    } else {
      try {
        const body = {
          password: values.password,
          reset_password_hash: id,
        };
        const res: any = await Models.user.resetPassword(body);
        navigate("/auth");
      } catch (err: any) {
        toastifyError(err);
      }
    }
  };
  return (
    <div className="auth_screen">
      <div className="auth_screen_wrapper">
        <div className="auth_screen_left_container">
          <div className="app_name_container">
            <img src={Assets.fullfily_logo} style={{ objectFit: "contain" }} height={180} width={500} />
          </div>
        </div>
        <div className="auth_screen_right_container">
          <div className="signup_screen">
            <div className="signup_screen_wrapper">
              <div className="signup_screen_container">
                <div className="signup_head_container">
                  <div className="signup_head_wrapper" style={{ justifyContent: "center" }}>
                    <div className="signup_head">Reset Password</div>
                  </div>
                </div>
                <div className="signup_input_wrapper">
                  <Formik
                    onSubmit={resetPassword}
                    validationSchema={validationSchema}
                    initialValues={{
                      password: "",
                      confirm_password: "",
                    }}
                  >
                    <Form>
                      <div className="signup_input_container">
                        <InputField name="password" type="password" placeholder="Password" />
                      </div>
                      <div className="signup_input_container">
                        <InputField name="confirm_password" type="password" placeholder="Confirm Password" />
                      </div>
                      <div className="submit_button_container">
                        <Button value="Reset Password" />
                      </div>
                    </Form>
                  </Formik>
                </div>
                <Divider style={{ width: "100%", margin: "1em 0" }} />
                <Link to="/auth">
                  <div className="signup_links_container">
                    <div className="signup_link">Login account</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
