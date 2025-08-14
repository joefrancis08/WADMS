const PATH = {
  PUBLIC: {
    DEFAULT_PATH: '/',
    REGISTER: '/register',
    LOGIN: '/login',
    NOT_FOUND_DEFAULT: '*',
    NOT_FOUND_URL: '/page-not-found'
  },

  UNVERIFIED_USER: {
    PENDING_VERIFICATION: '/pending-verification'
  },

  DEAN: {
    DASHBOARD: '/d',
    VERIFIED_USERS: '/d/verified-users',
    VERIFIED_USER_DETAIL: (id) => `/d/verified-users/${id}`,
    VERIFIED_USER_DETAIL_TEMPLATE: '/d/verified-users/:id',
    UNVERIFIED_USERS: '/d/unverified-users',
    UNVERIFIED_USERS_DETAIL: (id) => `/d/unverified-users/${id}`,
    TASK_FORCE: '/d/accreditation/task-force',
    DOCUMENTS: '/d/accreditation/documents'
  }
}

export default PATH;