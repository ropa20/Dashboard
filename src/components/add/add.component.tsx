import Divider from "common_components/ui/divider/divider.ui";
import InputField from "common_components/ui/field/field.ui";
import FileUpload from "common_components/ui/file_upload/file_upload.ui";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";
import * as Validation from "utils/validation.utils";
import React, { useRef, useEffect} from "react";
import "./add.component.scss";
import { useSetState } from "utils/functions.utils";
import { IAddValues } from "utils/interface.utils";
import CustomSelect from "common_components/ui/select/select.ui";
import Select from "components/select/select.component";
import ValidationError from "common_components/ui/error/error.ui";
import _ from "lodash";


interface addProps {
  data: any;
  values: IAddValues[];
  actions: { link: string; icon: string }[];
  hasFiles?: boolean;
  buttons?: any;
  title: string;
  logo?: any;
  initialValues: any;
  validationSchema: string;
  onSubmit: any;
  getForm?: any;
  ownVehicle?:any;
  payment_type?:any
  vehicle?:boolean
}
export default function Add(props: addProps) {
  const { data, values, actions = [], hasFiles, buttons, title, logo, initialValues, validationSchema, onSubmit, getForm,ownVehicle,payment_type } = props;
  const formikRef: any = useRef(null);
  const getEditableValues = () => {
    let newData = {};
    if (data) {
      Object.keys(data).forEach(item => {
        newData[item] = data[item] || initialValues[item];
        if (typeof data[item] === "object") {
          if (item === "hub") {
            newData[item] = data[item]["_id"];
          } else if (item === "city") {
            newData[item] = data[item]["_id"];
          } else if (item === "organization") {
            newData[item] = data[item]["_id"];
          } else {
            Object.keys(data[item]).forEach(key => {
              newData[item][key] = data[item][key] || initialValues[item][key];
            });
          }
        } else {
          newData[item] = data[item] || initialValues[item];
        }
      });
      return newData;
    }
    return data;
  };

  const [state, setState] = useSetState({
    form: data,
    role:'',
  });

  useEffect(() => {
    setState({ form: getEditableValues() });
  }, [data]);

  const conditionCheck = condition => {
    if (!condition) return true;
    if (condition(state.form)) {
      return true;
    }
  };


  const handleChange = form => {
    setState({ form });
    if(getForm){
      getForm(form);
    }
  };

  
  const value = getEditableValues() || initialValues;

  return (
    <div className="add_container">
      <div className="add_wrapper">
        <Formik
          ref={formikRef}
          onSubmit={onSubmit}
          validate={handleChange}
          initialValues={value}
          validationSchema={Validation[validationSchema]}
          enableReinitialize
        >
          <Form>
            <div className="add_head_container">
              <div className="title_container">{title}</div>
            </div>
            {logo && logo}
            <Divider />
            <div className="add_field_body_container">
              <div className="add_field_body_wrapper">
                {values.map(
                  ({ label, key, type, options, condition, additionalInfo }) =>
                    conditionCheck(condition) && (
                      <>
                        {type === "string" && (
                          <div className="add_field_container">
                            <InputField name={key} label={label} type="text" />
                          </div>
                        )}
            
                          {type === "remarks" && (
                          <div className="add_field_container">
                            <InputField className="remarks_wrapper" name={key} label={label} type="textarea" />
                          </div>
                          
                        )}
                        {type === "checkbox" && (
                          <div className="add_field_checkbox__container">
                            <Field name={key}>
                              {({ field, form }) => (
                                <>
                                  <input
                                    type="checkbox"
                                    name={key}
                                    checked={typeof state.form[key] === "boolean" ? state.form[key] : value[key]}
                                    onChange={event => form.setFieldValue(key, event.target.checked)}
                                  />
                                  <label> {label}</label>
                                </>
                              )}
                            </Field>
                          </div>
                        )}
                        {type === "number" && (
                          <div className="add_field_container">
                            <InputField name={key} label={label} type="number" />
                            {additionalInfo && <div className="additional_field">{additionalInfo}</div>}
                          </div>
                        )}
                        {type === "date" && (
                          <div className="add_field_container">
                            <InputField name={key} label={label} type="date" value={data[key]} />
                          </div>
                        )}
                        {type === "title" && <div className="title_container">{label}</div>}
                        {type === "select" && (
                          <div className="add_field_container">
                            <CustomSelect name={key} label={label} placeholder={label} options={options} />
                          </div>
                        )}
                        {type === "own_vehicle" && (
                          <div className="add_field_container">
                            <CustomSelect handleChange={val => ownVehicle(val)} name={key} label={label} placeholder={label} options={options} />
                          </div>
                        )}
                        {type === "payment_type" && (
                          <div className="add_field_container">
                            <CustomSelect
                              disable={true}
                              handleChange={val => payment_type(val)}
                              name={key}
                              label={label}
                              placeholder={label}
                              options={options}
                            />
                          </div>
                        )}

                        {type === "address" && (
                          <div className="add_field_container">
                            <Field name={key}>
                              {({ field, form }) => (
                                <Select
                                  name={key}
                                  onChange={val => form.setFieldValue(key, val)}
                                  label={label}
                                  type="address"
                                  placeholder="Type phone number by search"
                                  value={data[key] || ""}
                                />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}
                        {type === "hub" && (
                          <div className="add_field_container">
                            <Field name={key}>
                              {({ field, form }) => (
                                <Select
                                  name={key}
                                  onChange={val => form.setFieldValue(key, val)}
                                  label={label}
                                  type="hub"
                                  placeholder="Select hub"
                                  value={data[key] || ""}
                                />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}
                        {type === "city" && (
                          <div className="add_field_container">
                            <Field name={key}>
                              {({ field, form }) => (
                                <Select
                                  name={key}
                                  onChange={val => form.setFieldValue(key, val)}
                                  label={label}
                                  type="city"
                                  placeholder="Select city"
                                  value={data[key] || ""}
                                />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}

                        {type === "driver_status" && (
                          <div className="add_field_container">
                            <Field name={key}>
                              {({ field, form }) => (
                                <Select
                                  name={key}
                                  onChange={val => form.setFieldValue(key, val)}
                                  label={label}
                                  type="driver_status"
                                  placeholder="Select status"
                                  value={data[key] || ""}
                                />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}
                        {type === "store" && (
                          <div className="add_field_container">
                            <Field name={key}>
                              {({ field, form }) => (
                                <Select
                                  name={key}
                                  onChange={val => form.setFieldValue(key, val)}
                                  label={label}
                                  org={state.form.organization}
                                  type="store"
                                  value={data[key]?.name || ""}
                                />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}
                        {type === "organization" && (
                          <div className="add_field_container">
                            <Field name={key}>
                              {({ field, form }) => (
                                <Select
                                  name={key}
                                  onChange={val => form.setFieldValue(key, val)}
                                  label={label}
                                  type="organization"
                                  value={data[key] || ""}
                                />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}
                        {type === "dedicated_org" && (
                          <div className="add_field_container">
                            <Field name={key}>
                              {({ field, form }) => (
                                <Select
                                  name={key}
                                  onChange={val => form.setFieldValue(key, val)}
                                  label={label}
                                  type="dedicated_org"
                                  value={data[key]?.name || ""}
                                />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}
                        {type === "driver" && (
                          <div className="add_field_container">
                            <Field name={key}>
                              {({ field, form }) => (
                                <Select
                                  name={key}
                                  onChange={val => form.setFieldValue(key, val)}
                                  label={label}
                                  type="driver"
                                  value={data[key].name || ""}
                                />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}
                        {type === "store_driver" && (
                          <div className="add_field_container">
                            <Field name={key}>
                              {({ field, form }) => (
                                <Select
                                  name={key}
                                  onChange={val => form.setFieldValue(key, val)}
                                  label={label}
                                  type="store_driver"
                                  value={data[key].name || ""}
                                />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}
                        {type === "user" && (
                          <div className="add_field_container">
                            <Field name={key}>
                              {({ field, form }) => (
                                <Select
                                  name={key}
                                  onChange={val => form.setFieldValue(key, val)}
                                  label={label}
                                  type="user"
                                  value={data[key].username || ""}
                                />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}
                      </>
                    )
                )}
              </div>
            </div>
            {hasFiles && (
              <>
                <Divider />
                <div className="add_field_body_container">
                  <div className="add_field_body_wrapper">
                    {values.map(({ label, key, type }) => (
                      <>
                        {type === "file" && (
                          <div className="add_field_container">
                            <Field name={key}>
                              {({ field, form, meta }) => (
                                <FileUpload label={label} onChange={url => form.setFieldValue(field.name, url)} name={key} url={meta.value} />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}
                        {!props.vehicle && type === "passbook" && (
                          <div style={{ visibility: "hidden" }} className="add_field_container">
                            <Field name={key}>
                              {({ field, form, meta }) => (
                                <FileUpload label={label} onChange={url => form.setFieldValue(field.name, url)} name={key} url={meta.value} />
                              )}
                            </Field>
                            <ErrorMessage name={key} component={ValidationError} />
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </div>
              </>
            )}
            {buttons && buttons}
          </Form>
        </Formik>
      </div>
    </div>
  );
}
