import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({ ref, selected, onChange, placeholder, className, onFocus, onBlur, dateFormat, minDate, disabled, open, onClickOutside }) => {
  return (
    <DatePicker
      ref={ref}
      selected={selected} 
      onChange={onChange} 
      placeholderText={placeholder}
      className={className}
      onFocus={onFocus}
      onBlur={onBlur}
      dateFormat={dateFormat}
      minDate={minDate}
      disabled={disabled}
      open={open}
      onClickOutside={onClickOutside}
      showYearPicker
    />
  );
};

export default DatePickerComponent;