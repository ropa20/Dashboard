import { Form, Formik } from 'formik';
import * as yup from 'yup';
import React from 'react';
import './signup.screen.scss';
import InputField from 'common_components/ui/field/field.ui';
import Button from 'common_components/ui/button/button.ui';
import Divider from 'common_components/ui/divider/divider.ui';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div className="signup_screen">
      <div className="signup_screen_wrapper">
        <div className="signup_screen_container">
          <div className="signup_head_container">
            <div className="forgot_head_wrapper">
              <div className="signup_head">Email send</div>
              <div className="signup_desc">
                We have send you a mail to reset your password. Check your mail.
              </div>
            </div>
          </div>
          <div className="signup_input_wrapper">
            <Link to="/auth/reset_password">
              <div className="gotomail_button_container">
                <Button value="Go to mail" />
              </div>
            </Link>
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
