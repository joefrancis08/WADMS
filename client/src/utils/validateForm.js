import { emailRegex, passwordRegex } from "./regEx.js";

// For Registration
export const validateForm = (values) => {
  const emptyFieldMessage = 'This field is required.';
  const errors = {};

  if (!values.fullName?.trim()) {
    errors.fullName = emptyFieldMessage;
  } 

  if (!values.email?.trim()) {
    errors.email = emptyFieldMessage;
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Please enter a valid email (e.g., user@example.com).';
  }

  if (!values.password?.trim()) {
    errors.password = emptyFieldMessage;
  } else if (!passwordRegex.test(values.password)) {
    errors.password = 'Password must be at least 8 characters long with uppercase and lowercase letters, a number, and a symbol.';
  }

  return errors;
}