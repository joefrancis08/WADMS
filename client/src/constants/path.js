const PATH = {
  PUBLIC: {
    DEFAULT: '/',
    REGISTER: '/register',
    NOT_FOUND: '*'
  },

  UNVERIFIED_USER: {
    PENDING: '/pending-verification'
  },

  ADMIN: {
    DASHBOARD: '/admin',
    VERIFIED_USERS: '/admin/verified-users',
    VERIFIED_USERS_ID: 'admin/verified-users/:id',
    UNVERIFIED_USERS: 'admin/unverified-users',
    UNVERIFIED_USERS_ID: 'admin/unverified-users/:id'
  }
}

export default PATH;