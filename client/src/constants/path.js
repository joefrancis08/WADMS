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
    TASK_FORCE: '/d/task-force',
    TASK_FORCE_DETAIL: (role, id) => `/d/task-force/${role}/${id}`,
    TASK_FORCE_DETAIL_TEMPLATE: '/d/task-force/:role/:id',
    DOCUMENTS: '/d/accreditation/documents'
  }
}

export default PATH;