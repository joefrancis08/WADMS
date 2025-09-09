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

    PROGRAMS_TO_BE_ACCREDITED: '/d/accreditation/programs',

    PROGRAM_AREAS: ({ period, level, program }) => (
      `/d/accreditation/programs/${level}/${program}/${period}`
    ),
    PROGRAM_AREAS_TEMPLATE: '/d/accreditation/programs/:level/:program/:period',

    AREA_PARAMETERS: ({ period, level, program, area }) => (
      `/d/accreditation/programs/${level}/${program}/${period}/${area}`
    ),
    AREA_PARAMETERS_TEMPLATE: '/d/accreditation/programs/:level/:program/:period/:area',

    PARAM_SUBPARAMS: ({ period, level, program, area, parameter }) => (
      `/d/accreditation/programs/${level}/${program}/${period}/${area}/${parameter}`
    ),
    PARAM_SUBPARAMS_TEMPLATE: '/d/accreditation/programs/:level/:program/:period/:area/:parameter',
    DOCUMENTS: '/d/accreditation/documents'
  }
}

export default PATH;