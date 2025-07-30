import { emailRegex, passwordRegex } from "./regEx.js";
import { VALIDATION_MESSAGE } from "../constants/messages.js"; 

const { FULLNAME, EMAIL, PASSWORD } = VALIDATION_MESSAGE();

// For Registration
export const validateForm = (values) => {
  const errors = {};

  if (!values.fullName?.trim()) {
    errors.fullName = FULLNAME.EMPTY;
  } 

  if (!values.email?.trim()) {
    errors.email = EMAIL.EMPTY;
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Please enter a valid email (e.g., user@domain.com).';
  }

  if (!values.password?.trim()) {
    errors.password = PASSWORD.EMPTY;
  } else if (!passwordRegex.test(values.password)) {
    errors.password = 'Password must be at least 8 characters long with uppercase and lowercase letters, a number, and a symbol.';
  }

  return errors;
}