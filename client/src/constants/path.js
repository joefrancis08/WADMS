const PATH = {
  PUBLIC: {
    DEFAULT_PATH: '/',
    REGISTER: '/register',
    NOT_FOUND: '*'
  },

  UNVERIFIED_USER: {
    PENDING_VERIFICATION: '/pending-verification'
  },

  ADMIN: {
    DASHBOARD: '/d',
    VERIFIED_USERS: '/d/verified-users',
    VERIFIED_USER_DETAIL: (id) => `/d/verified-users/${id}`,
    VERIFIED_USER_DETAIL_TEMPLATE: '/d/verified-users/:id',
    UNVERIFIED_USERS: '/d/unverified-users',
    UNVERIFIED_USERS_DETAIL: (id) => `/d/unverified-users/${id}`
  }
}

export default PATH;