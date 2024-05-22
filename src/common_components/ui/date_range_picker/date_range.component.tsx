import React from "react";
import DateRangePickers from "@wojtekmaj/react-daterange-picker";
import './date_range.component.scss'
import _ from "lodash";
import moment from "moment";

interface IDateRangePicker {
  value: any;
  onChange: any;
}

const DateRangePicker = (props: IDateRangePicker) => {
  const handleChange = (e: any) => {
    if (_.isEmpty(e)) {
      props.onChange(["", ""]);
    } else props.onChange(e);
  };
  
  return (
    <div className="date_picker_container">
      <DateRangePickers dayPlaceholder={moment().format('D')} monthPlaceholder={moment().format('M')} yearPlaceholder={moment().format('YYYY')}  className="date_range_picker_item" onChange={handleChange} value={props.value} />
    </div>
  );
};

export default DateRangePicker;


