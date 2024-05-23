import { Form, Formik } from 'formik';
import * as yup from 'yup';
import React from 'react';
import './signup.screen.scss';
import InputField from 'common_components/ui/field/field.ui';
import Button from 'common_components/ui/button/button.ui';
import Divider from 'common_components/ui/divider/divider.ui';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Models from 'imports/models.import';
import { toastifyError } from 'utils/functions.utils';

export default function ResetPassword() {
  const validationSchema = yup.object({
    email: yup.string().required('Please enter email'),
  });

  // navigation
  const navigate = useNavigate()

  const forgotPassword = async (values: any) => {
    try {
      const body = {
        email: values.email,
      };
      const res: any = await Models.user.forgotPassword(body);
      navigate("/auth/forgot_password");
    } catch (err: any) {
      toastifyError(err);
    }
  };
  return (
    <div className="signup_screen">
      <div className="signup_screen_wrapper">
        <div className="signup_screen_container">
          <div className="signup_head_container">
            <div className="signup_head_wrapper" style={{justifyContent: 'center'}}>
              <div className="signup_head">Reset Password</div>
              <div className="signup_desc">
                Please enter your registered email. We will send you a mail to
                reset your password.
              </div>
            </div>
          </div>
          <div className="signup_input_wrapper">
            <Formik
              onSubmit={forgotPassword}
              validationSchema={validationSchema}
              initialValues={{
                email: '',
               
              }}>
              <Form>
                <div className="signup_input_container">
                  <InputField
                    name="email"
                    type="text"
                    placeholder="Email"
                  />
                </div>                
                <div className="submit_button_container">
                  <Button value="Submit" />
                </div>
              </Form>
            </Formik>
          </div>
          <Divider style={{ width: '100%', margin: '1em 0' }} />
          <Link to="/auth">
            <div className="signup_links_container">
              <div className="signup_link">Login account</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
