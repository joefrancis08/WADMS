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
    DASHBOARD: '/admin',
    VERIFIED_USERS: '/admin/verified-users',
    VERIFIED_USER_DETAIL: (id) => `/admin/verified-users/${id}`,
    VERIFIED_USER_DETAIL_TEMPLATE: '/admin/verified-users/:id',
    UNVERIFIED_USERS: '/admin/unverified-users',
    UNVERIFIED_USERS_DETAIL: (id) => `/admin/unverified-users/${id}`
  }
}

export default PATH;