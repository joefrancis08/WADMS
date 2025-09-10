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

    PROGRAM_AREAS: ({ periodID, level, programID }) => (
      `/d/accreditation/programs/${level}/${programID}/${periodID}`
    ),
    PROGRAM_AREAS_TEMPLATE: '/d/accreditation/programs/:level/:programID/:periodID',

    AREA_PARAMETERS: ({ periodID, level, programID, areaID }) => (
      `/d/accreditation/programs/${level}/${programID}/${periodID}/${areaID}`
    ),
    AREA_PARAMETERS_TEMPLATE: '/d/accreditation/programs/:level/:programID/:periodID/:areaID',

    PARAM_SUBPARAMS: ({ periodID, level, programID, areaID, parameterID }) => (
      `/d/accreditation/programs/${level}/${programID}/${periodID}/${areaID}/${parameterID}`
    ),
    PARAM_SUBPARAMS_TEMPLATE: '/d/accreditation/programs/:level/:programID/:periodID/:areaID/:parameterID',
    DOCUMENTS: '/d/accreditation/documents'
  }
}

export default PATH;