const PATH = {
  PUBLIC: {
    DEFAULT_PATH: '/',
    REGISTER: '/register',
    LOGIN: '/login',
    EMAIL_CONFIRMATION: '/email-confirmation',
    NOT_FOUND_DEFAULT: '*',
    NOT_FOUND_URL: '/page-not-found'
  },

  UNVERIFIED_USER: {
    PENDING: '/pending-verification',
  },

  DEAN: {
    DASHBOARD: '/d',
    UNVERIFIED_USER: '/d/unverified-user',
    TASK_FORCE: '/d/task-force',
    TASK_FORCE_DETAIL: (uuid) => `/d/task-force/${uuid}`,
    TASK_FORCE_DETAIL_TEMPLATE: '/d/task-force/:uuid',

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

    SUBPARAM_INDICATORS: ({
      accredInfoUUID,
      level,
      programUUID,
      areaUUID,
      parameterUUID,
      subParameterUUID
    }) => (
      `/d/accreditation/programs/${level}/${programUUID}/${accredInfoUUID}/${areaUUID}/${parameterUUID}/${subParameterUUID}`
    ),
    SUBPARAM_INDICATORS_TEMPLATE: '/d/accreditation/programs/:level/:programUUID/:accredInfoUUID/:areaUUID/:parameterUUID/:subParameterUUID',
    
    DOCUMENTS: '/d/accreditation/documents'
  },

  TASK_FORCE: {
    DASHBOARD: '/t',
    ACCREDITATION: '/t/accreditation'
  },

  INTERNAL_ASSESSOR: {
    DASHBOARD: '/ia',
  }
}

export default PATH;