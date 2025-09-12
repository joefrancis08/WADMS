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

    PROGRAM_AREAS: ({ accredInfoUUID, level, programUUID }) => (
      `/d/accreditation/programs/${level}/${programUUID}/${accredInfoUUID}`
    ),
    PROGRAM_AREAS_TEMPLATE: '/d/accreditation/programs/:level/:programUUID/:accredInfoUUID',

    AREA_PARAMETERS: ({ accredInfoUUID, level, programUUID, areaUUID }) => (
      `/d/accreditation/programs/${level}/${programUUID}/${accredInfoUUID}/${areaUUID}`
    ),
    AREA_PARAMETERS_TEMPLATE: '/d/accreditation/programs/:level/:programUUID/:accredInfoUUID/:areaUUID',

    PARAM_SUBPARAMS: ({ accredInfoUUID, level, programUUID, areaUUID, parameterUUID }) => (
      `/d/accreditation/programs/${level}/${programUUID}/${accredInfoUUID}/${areaUUID}/${parameterUUID}`
    ),
    PARAM_SUBPARAMS_TEMPLATE: '/d/accreditation/programs/:level/:programUUID/:accredInfoUUID/:areaUUID/:parameterUUID',
    DOCUMENTS: '/d/accreditation/documents'
  }
}

export default PATH;