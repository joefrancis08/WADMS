const PATH = {
  PUBLIC: {
    DEFAULT_PATH: '/',
    REGISTER: '/register',
    LOGIN: '/login',
    NOT_FOUND_DEFAULT: '*',
    NOT_FOUND_URL: '/page-not-found'
  },

  DEAN: {
    DASHBOARD: '/d',
    TASK_FORCE: '/d/task-force',
    TASK_FORCE_DETAIL: (id) => `/d/task-force/${id}`,
    TASK_FORCE_DETAIL_TEMPLATE: '/d/task-force/:id',
    PROGRAMS_TO_ACCREDIT: '/d/accreditation/programs-to-accredit',
    DOCUMENTS: '/d/accreditation/documents'
  }
}

export default PATH;