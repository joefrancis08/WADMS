export const TOAST_MESSAGES = Object.freeze({
  REGISTRATION: {
    SUCCESS: 'Registration successful',
    UNSUCCESSFUL: 'Unsuccessful registration. Try again',
    ERROR: 'Something went wrong. Please try again later.'
  },

  LOGIN: {
    SUCCESS: 'Logged in successfully!',
    UNSUCCESSFUL: 'Unsuccessful login. Try again.',
    ERROR: 'Something went wrong. Please try again later.'
  },

  UU_VERIFICATION: {
    SUCCESS: 'Verified successfully!',
    ERROR: 'Something went wrong. Try again.'
  },

  UU_UPDATE: {
    SUCCESS: 'Updated successfully!',
    ERROR: 'Something went wrong. Try again.'
  },

  UU_DELETION: {
    SUCCESS: 'Deleted successfully!',
    ERROR: 'Something went wrong. Try again.'
  },

  UNVERIFIED_USER_UPDATE: {
    SUCCESS: 'Verified successfully.',
    ERROR: 'Something went wrong while verifying user. Try again.'
  },

  TASK_FORCE_DELETION: {
    SUCCESS: 'Deleted successfully.',
    ERROR: 'Something went wrong. Try again.'
  },

  TASK_FORCE_CREATION: {
    SUCCESS: 'Created successfully.',
    ERROR: 'Something went wrong while creating task force.'
  },

  TASK_FORCE_UPDATE: {
    SUCCESS: 'Updated successfully.',
    ERROR: 'Something went wrong while updating user. Try again.'
  },

  IA_ADDITION: {
    SUCCESS: 'New internal assessor added successfully!',
    ERROR: 'Error adding new internal assessor'
  },

  IA_DELETION: {
    SUCCESS: (fullName) => `${fullName} deleted successfully!`,
    ERROR: (fullName) => `Error deleting ${fullName}`
  },

  PROGRAMS_TO_BE_ACCREDITED_CREATION: {
    SUCCESS: 'Created successfully.',
    ERROR: 'Something went wrong while creating period, level, and programs.'
  },

  PROGRAMS_TO_BE_ACCREDITED_ADDITION: {
    SUCCESS: 'Added successfully.',
    ERROR: 'Something went wrong while adding programs to be accredited.'
  },

  PROGRAMS_TO_BE_ACCREDITED_DELETION: {
    SUCCESS: 'Deleted successfully!',
    ERROR: 'Something went wrong while deleting programs to be accredited.'
  },

  PERIOD_DELETION: {
    SUCCESS: 'Deleted successfully!',
    ERROR: 'Something went wrong while deleting period.'
  },

  AREA_ADDITION: {
    SUCCESS: 'Added successfully!',
    ERROR: 'Something went wrong while adding area.'
  },

  PARAMETER_ADDITION: {
    SUCCESS: 'Added successfully!',
    ERROR: 'Something went wrong while adding parameters.'
  },

  SUBPARAMETER_ADDITION: {
    SUCCESS: 'Added successfully!',
    ERROR: 'Something went wrong while adding sub-parameters.'
  },

  INDICATORS_ADDITION: {
    SUCCESS: 'Added successfully!',
    ERROR: 'Something went wrong while adding indicators.'
  },

  ASSIGNMENT: {
    SUCCESS: 'Assigned successfully!',
    ERROR: 'Something went wrong while assigning. Try again.'
  },

  UNASSIGN: {
    SUCCESS: 'Unassigned successfully!',
    ERROR: 'Something went wrong while unassigning. Try again'
  }
});

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