import { ErrorMessage, Field } from 'formik';
import React from 'react';
import './field.ui.scss';
import ValidationError from '../error/error.ui';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { useSetState } from 'utils/functions.utils';
import Assets from 'imports/assets.import';
interface InputProps {
  className?: string;
  label?: string;
  type: 'text' | 'password' | 'number' | 'textarea' | 'date';
  placeholder?: string;
  name: string;
  value?: string;
  id?: string;
}

const InputField = (props: InputProps) => {
  const [state, setState] = useSetState({ isPwdShow: false });
  const { label, type, name, className, placeholder, value, id } = props;
  let additionalProps = {
    value: value
  }
  if(!value) {
    delete additionalProps.value
  }
  return (
    <div className="input_container">
      <div className="label_container caption2">{label}</div>
      {type === 'text' && (
        <div className="field_wrap">
          <Field
            name={name}
            type={type}
            className={`${className} input menu`}
            autoComplete="off"
            placeholder={placeholder}
            {...additionalProps}
            />
          <ErrorMessage name={name} component={ValidationError} />
        </div>
      )}
      {type === 'password' && (
        <div className="field_wrap">
          <div className='password_wrap'>
          <Field
            name={name}
            type={state.isPwdShow ? "text" : "password"}
            className={`${className} input menu`}
            autoComplete="off"
            placeholder={placeholder}
          />
          <div className="pwd_icon" onClick={() => setState({ isPwdShow: !state.isPwdShow })}>
            {state.isPwdShow ? <img src={Assets.pwd_view} /> : <img src={Assets.pwd_hide} />}
          </div>
          </div>
          <ErrorMessage name={name} component={ValidationError} />
        </div>
      )}
      {type === 'number' && (
        <div className="field_wrap">
          <Field
            id={id}
            name={name}
            type={type}
            className={`${className} input menu`}
            autoComplete="off"
            placeholder={placeholder}
          />
          <ErrorMessage name={name} component={ValidationError} />
        </div>
      )}
      {type === 'textarea' && (
        <div className="field_wrap">
          <Field
            as="textarea"
            name={name}
            type="textarea"
            className={`${className} input input_textarea menu`}
            placeholder={placeholder}
          />
          <ErrorMessage name={name} component={ValidationError} />
        </div>
      )}
      {type === 'date' && (
        <div className="field_wrap">
          <Field name={name}>
            {({ form, field }) => {
              let date = field.value ? new Date(field.value) : null;
              return <DatePicker 
                selected={date && date}
                placeholderText="Select a date"
                dateFormat="MMMM d, yyyy"
                className="date-picker"
                name={name}
                onChange={date => form.setFieldValue(name, date)}
              />
            }
            }
          </Field>
          <ErrorMessage name={name} component={ValidationError} />
        </div>
      )}
    </div>
  );
};

InputField.defaultProps = {
  className: '',
  label: '',
  placeholder: '',
};

export default InputField;
