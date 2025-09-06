const PATH = {
  PUBLIC: {
    DEFAULT_PATH: '/',
    REGISTER: '/register',
    EMAIL_CONFIRMATION: '/email-confirmation',
    NOT_FOUND_DEFAULT: '*',
    NOT_FOUND_URL: '/page-not-found'
  },

  DEAN: {
    DASHBOARD: '/d',
    TASK_FORCE: '/d/task-force',
    TASK_FORCE_DETAIL: (id) => `/d/task-force/${id}`,
    TASK_FORCE_DETAIL_TEMPLATE: '/d/task-force/:id',
    PROGRAMS_TO_BE_ACCREDITED: '/d/accreditation/programs-to-be-accredited',
    PROGRAM_AREAS: (period, level, program) => (
      `/d/accreditation/programs-to-be-accredited/${period}/${level}/${program}/areas`
    ),
    PROGRAM_AREAS_TEMPLATE: '/d/accreditation/programs-to-be-accredited/:period/:level/:program/areas', 
    DOCUMENTS: '/d/accreditation/documents'
  }
}

export default PATH;