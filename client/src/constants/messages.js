export const TOAST_MESSAGES = {
  REGISTRATION: {
    SUCCESS: 'Registration successful',
    UNSUCCESSFUL: 'Unsuccessful registration. Try again',
    ERROR: 'Something went wrong. Please try again later.'
  },

  USER_UPDATE: {
    SUCCESS: 'Verification successful.',
    ERROR: 'Something went wrong while verifying user. Try again.'
  }, 

  USER_DELETION: {
    SUCCESS: 'User deleted successfully.',
    ERROR: 'Something went wrong. Try again.'
  }
}

export const VALIDATION_MESSAGE = () => {
  const EMPTY = 'This field is required.';

  return {
    FULLNAME: {
      EMPTY
    }, 

    EMAIL: {
      EMPTY,
      INVALID: 'Please enter a valid email (e.g., user@domain.com).',
      ALREADY_EXIST: 'This email was already registered. Try another.',
      NOT_EXIST: 'Email does not exist. Register first.'
    },

    PASSWORD: {
      EMPTY,
      INVALID: 'Password must be at least 8 characters long with uppercase and lowercase letters, a number, and a symbol.'
    }
  };
}