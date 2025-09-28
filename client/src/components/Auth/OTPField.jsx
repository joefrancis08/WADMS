import React, { forwardRef } from 'react';

const OTPField = forwardRef(({ value, onChange, autoFocus = false }, ref) => {
  const handleChange = (e) => {
    const val = e.target.value;

    // Only accept digits (0-9)
    if (/^\d$/.test(val)) {
      onChange(val);

      // Move to next field automatically if 1 digit is entered
      if (e.target.nextSibling) {
        e.target.nextSibling.focus();
      }
    } else if (val === "") {
      onChange(""); // allow clearing
    }
  };

  const handleKeyDown = (e) => {
    // Move back if Backspace is pressed and current field is empty
    if (e.key === "Backspace" && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  return (
    <input
      ref={ref}
      autoFocus={autoFocus}
      type="text"
      inputMode="numeric"     // mobile numeric keypad
      maxLength={1}           // only 1 digit
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="outline-slate-600 outline h-12 w-10 rounded text-center text-2xl font-semibold focus:outline-green-700 focus:outline-3 focus:shadow transition caret-transparent"
    />
  );
});

export default OTPField;
