import { USER_ROLES } from '../constants/user';
import useFetchAreasByLevel from '../hooks/fetch-react-query/useFetchAreasByLevel';

export const getUserRolesDropdown = (currentValue, options = {}) => {
  return Object.entries(USER_ROLES)
    .filter(([_, roleValue]) =>
      roleValue !== USER_ROLES.UNVERIFIED_USER &&
      roleValue !== USER_ROLES.DEAN &&
      roleValue !== USER_ROLES.IA &&
      roleValue !== USER_ROLES.ACCREDITOR &&
      roleValue !== currentValue
    )
    .map(([_, roleValue]) => roleValue);
};
