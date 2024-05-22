import React from "react";
import "./select_dropdown.component.scss";
import Select, { components } from "react-select";

interface ISelectDropdown {
  value: string;
  onChange: Function;
  data: any;
  placeholder?: string;
  notfound: any;
}

const SelectDropdown = (props: ISelectDropdown) => {
  const handleFilter = (e: any) => {
    console.log("filter", e);
    props.onChange(e);
  };

  return (
    <div className="select_dropdown_container">
      <Select
        theme={theme => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary: "#734F96",
            primary25: "#FFFFFF",
            primary50: "#FFFFFF",
          },
        })}
        styles={{
          control: (baseStyle, state) => ({
            ...baseStyle,
            outline: "none",
            border: state.isFocused ? "1px solid #734F96" : "none",
            cursor: "pointer",
            "&:hover": {
              cursor: "pointer",
            },
          }),
        }}
        onChange={(e: any) => handleFilter(e)}
        noOptionsMessage={() => props.notfound}
        placeholder={props.placeholder}
        options={props.data}
      />
    </div>
  );
};

export default SelectDropdown;
