import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({ selected, onChange, placeholder, className, onFocus, onBlur, dateFormat, minDate, disabled }) => {
  return (
    <DatePicker 
      selected={selected} 
      onChange={onChange} 
      placeholderText={placeholder}
      className={className}
      onFocus={onFocus}
      onBlur={onBlur}
      dateFormat={dateFormat}
      minDate={minDate}
      disabled={disabled}
    />
  );
};

export default DatePickerComponent;