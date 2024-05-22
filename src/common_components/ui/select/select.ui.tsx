import { Field, ErrorMessage } from "formik";
import React from "react";
import Select from "react-select";
import ValidationError from "../error/error.ui";
import "./select.scss";
import Colors from "imports/color.import";

interface optionObject {
  value: number | string | boolean;
  label: string;
}

interface customSelectProps {
  label?: string;
  className?: string;
  name: string;
  placeholder: string;
  options?: optionObject[];
  isMulti?: boolean;
  handleChange?: any;
  disable?: any;
}

export const CustomSelect = (props: customSelectProps) => {
  const { label, className, name, placeholder, options, isMulti, handleChange } = props;

  const onChange = (option: any, form, field) => {
    handleChange(option);
    form.setFieldValue(field.name, isMulti ? (option as any[]).map((item: any) => item.value) : (option as any).value);
  };

  const getValue = field => {
    if (options) {
      return isMulti ? options.filter(option => field.value.indexOf(option.value) >= 0) : options.find(option => option.value === field.value);
    }
  };

  const customStyle = {
    container: (style, state) => ({
      ...style,
      outline: "none",
    }),
    control: (style, state) => ({
      ...style,
      backgroundColor: "white",
      fontSize: "14px",
      fontWeight: "600",
      padding: "",
      borderRadius: "10px",
      height: "56px",
      outline: "none",
      ":hover": {
        border: `2px solid ${Colors.primary}`,
      },
      border: state.isFocused ? `2px solid ${Colors.primary}` : `2px solid ${Colors.border}`,
    }),
    option: (style, state) => ({
      ...style,
      fontSize: "14px",
      fontWeight: "600",
      padding: "1em",
      width: "96%",
      margin: "2%",
      borderRadius: "10px",
      color: state.isSelected ? "white" : state.isFocused ? "white" : "#11142d",
      backgroundColor: state.isSelected ? "#734F96" : state.isFocused ? "#734F96" : "#e4e4e4",
      cursor: "pointer",
    }),
    menu: style => ({
      ...style,
      borderRadius: "10px",
    }),
  };

  return (
    <div className="select_container">
      <div className="select_label caption2">{label || ""}</div>
      <Field name={name}>
        {({ field, form }) => {
          return (
            <Select
              className={`${className} select_input`}
              name={field.name}
              value={getValue(field)}
              onChange={e => onChange(e, form, field)}
              placeholder={placeholder}
              isSearchable={props.disable ? false : true}
              options={options}
              isMulti={isMulti}
              styles={customStyle}
              components={{ IndicatorSeparator: () => null }}
            />
          );
        }}
      </Field>
      <ErrorMessage name={name} component={ValidationError} />
    </div>
  );
};

CustomSelect.defaultProps = {
  label: "",
  className: "",
  isMulty: false,
  handleChange: () => {},
  options: [],
};

export default CustomSelect;
