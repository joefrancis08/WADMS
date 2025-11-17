import apiClient from "../../services/axios/apiClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addInfoLevelProgram = ({ title, year, accredBody, level, programNames }) => {
  return apiClient.post(`/accreditation/add-info-level-programs`, {
    title,
    year,
    accredBody, 
    level,
    programNames
  });
};

export const addProgramAreas = ({ title, year, accredBody, level, program, areaNames }) => {
  return apiClient.post(`/accreditation/add-program-areas`, {
    title, 
    year, 
    accredBody, 
    level,
    program, 
    areaNames
  });
};

export const addAreaParameters = ({ title, year, accredBody, level, program, area, parameterNames }) => {
  return apiClient.post(`/accreditation/add-area-parameters`, {
    title,
    year,
    accredBody,
    level,
    program,
    area,
    parameterNames
  });
};

export const addSubParams = ({ 
  title, 
  year, 
  accredBody, 
  level, 
  program, 
  area, 
  parameter, 
  subParameterNames 
}) => {
  return apiClient.post(`/accreditation/add-parameter-subparameters`, {
    title,
    year,
    accredBody,
    level,
    program,
    area,
    parameter,
    subParameterNames
  });
};

export const addIndicators = ({
  title,
  year,
  accredBody,
  level,
  program,
  area, 
  parameter,
  subParameter,
  indicatorNames
}) => {
  return apiClient.post(`/accreditation/add-subparameter-indicators`, {
    title,
    year,
    accredBody,
    level,
    program,
    area,
    parameter,
    subParameter,
    indicatorNames
  });
};

export const addDocument = async (formData) => {
  return apiClient.post(`/accreditation/add-document`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addAssignment = async (data = {}, condition = {}) => {
  return apiClient.post(`${API_BASE_URL}/accreditation/add-assignment`, {
    userIDList: data.userIDList,
    accredInfoId: data.accredInfoId,
    levelId: data.levelId,
    programId: data.programId,
    areaId: data.areaId,
    parameterId: condition.includeParameter ? data.parameterId : null,
    subParameterId: condition.includeSubParameter ? data.subParameterId : null,
    indicatorId: condition.includeIndicator ? data.indicatorId : null
  })
};

export const fetchILP = (controller) => {
  return apiClient.get(`/accreditation/fetch-info-level-programs`, {
    signal: controller.signal
  });
};

export const fetchProgramProgress = (signal) => {
  return apiClient.get(`/accreditation/fetch-program-progress`, {
    signal
  });
};

export const fetchAccreditationLevels = (controller) => {
  return apiClient.get(`/accreditation/fetch-accreditation-levels`, {
    signal: controller.signal
  });
};

export const fetchAreasByLevel = (level, controller) => {
  return apiClient.get(`/accreditation/fetch-program-areas-by`, {
    params: {
      level
    },
    signal: controller.signal
  });
};

export const fetchAreaProgress = (programId, signal) => {
  return apiClient.get(`/accreditation/fetch-area-progress`, {
    params: { programId },
    signal
  });
};

export const fetchParamByAreaId = (areaId, signal) => {
  return apiClient.get(`/accreditation/fetch-area-parameters-by`, {
    params: {
      areaId
    },
    signal
  });
};

export const fetchParameterProgress = (areaId, signal) => {
  return apiClient.get(`/accreditation/fetch-parameter-progress`, {
    params: { areaId },
    signal
  });
}

export const fetchSubParamByParamId = (parameterId, signal) => {
  return apiClient.get(`/accreditation/fetch-parameter-subparameters-by`, {
    params: {
      parameterId
    },
    signal
  });
};

export const fetchIndicatorBySubparamId = (subParamId, signal) => {
  return apiClient.get(`/accreditation/fetch-subparameter-indicators-by`, {
    params: {
      subParamId
    },
    signal
  });
};

export const fetchAccreditationPeriod = (controller) => {
  return apiClient.get(`/accreditation/fetch-accreditation-period`, {
    signal: controller.signal
  });
};

export const fetchProgramAreas = ({ title, year, accredBody, level, program }, controller) => {
  return apiClient.get(`/accreditation/fetch-program-areas`, {
    params: {
      title,
      year,
      accredBody,
      level,
      program
    }, 
    signal: controller.signal
  });
};

export const fetchAreaParameters = ({ title, year, accredBody, level, program, area }, controller) => {
  return apiClient.get(`/accreditation/fetch-area-parameters`, {
    params: {
      title,
      year,
      accredBody,
      level,
      program,
      area
    },
    signal: controller.signal
  });
};

export const fetchParamSubparams = ({ 
  title,
  year,
  accredBody,
  level,
  program,
  area,
  parameter
 }, controller) => {
  return apiClient.get(`/accreditation/fetch-parameter-subparameters`, {
    params: {
      title,
      year,
      accredBody,
      level,
      program,
      area,
      parameter
    }, 
    signal: controller.signal
  });
};

export const fetchSubparamIndicators = ({
  title,
  year,
  accredBody,
  level,
  program,
  area,
  parameter,
  subParameter
}, controller) => {
  return apiClient.get(`/accreditation/fetch-subparameter-indicators`, {
    params: {
      title,
      year,
      accredBody,
      level,
      program,
      area,
      parameter,
      subParameter
    },
    signal: controller.signal
  });
};

export const fetchDocuments = (data = {}, controller) => {
  const {
    title,
    year,
    accredBody,
    level,
    program,
    area,
    parameter,
    subParameter,
    indicator
  } = data;

  return apiClient.get(`/accreditation/fetch-documents`, {
    params: {
      title,
      year,
      accredBody,
      level,
      program,
      area,
      parameter,
      subParameter,
      indicator
    },
    signal: controller.signal
  });
};

export const fetchDocumentsByUploaderId = (uploaderId, signal) => (
  apiClient.get(`/accreditation/fetch-documents-by`, {
    params: { uploaderId },
    signal
  })
);

export const fetchDocumentsDynamically = async (data = {}) => {
  const {
    accredInfoId,
    levelId,      
    programId,
    areaId,
    parameterId,
    subParameterId,
    indicatorId
  } = data;

  return apiClient.get(`/accreditation/fetch-documents`, {
    params: {
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId,
      subParameterId,
      indicatorId
    }
  }).then(res => res.data); // React Query expects the resolved data
};

export const fetchAssignments = (data = {}, signal) => {
  const { 
    accredInfoId, levelId, programId, areaId, 
    parameterId, subParameterId, indicatorId
  } = data;
  return apiClient.get(`${API_BASE_URL}/accreditation/fetch-assignments`, {
    params: {
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId,
      subParameterId,
      indicatorId
    },
    signal
  });
};

export const fetchAssignmentsByUserId = (userId, signal) =>
  apiClient.get('/accreditation/fetch-assignments-by-user-id', {
    params: { userId },
    signal
  });

export const fetchAccreditationBodies = (signal) => {
  return apiClient.get(`/accreditation-body/fetch-accreditation-bodies`, {
    signal
  });
};

export const fetchAreaTaskForce = ({ accredInfoId, levelId, programId, areaId },signal) => {
  return apiClient.get(`/accreditation/fetch-area-task-force`, {
    params: { 
      accredInfoId, 
      levelId, 
      programId, 
      areaId 
    },
    signal
  });
};

export const updateDocName = (docId, newFileName) => {
  return apiClient.patch(`/accreditation/rename-document/${docId}`, {
    newFileName
  }, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const deleteAccredInfo = (data = {}, condition = {}) => {
  return apiClient.delete(`/accreditation/delete-info-level-program`, {
    params: {
      title: data.title,
      year: data.year,
      accredBody: data.accredBody,
      level: condition.includeLevel ? data.level : null,
      program: condition.includeProgram ? data.program : null,
    }
  });
};

export const deletePAM = ({
  title,
  year,
  accredBody,
  level,
  program,
  area
}) => {
  return apiClient.delete(`/accreditation/delete-program-area`, {
    params: {
      title,
      year,
      accredBody,
      level,
      program,
      area
    }
  });
};

export const deleteAPM = (data = {}) => {
  const { id, parameter } = data;
  
  return apiClient.delete(`/accreditation/delete-area-parameter`, {
    params: {
      id,
      parameter
    }
  });
};

export const deletePSPM = (data = {}) => {
  const { pspmId, subParameterId, subParameter } = data;

  return apiClient.delete(`/accreditation/delete-param-subparam`, {
    params: {
      pspmId,
      subParameterId,
      subParameter
    }
  });
};

export const deleteDoc = (docId) => {
  return apiClient.delete(`/accreditation/delete-document`, {
    params: {
      docId
    }
  });
};

export const deleteAssignment = (data = {}) => {
  const { 
    accredInfoId, levelId, programId, areaId, parameterId, subParameterId, indicatorId, taskForceId 
  } = data;

  return apiClient.delete(`/accreditation/delete-assignment`, {
    params: {
      taskForceId,
      accredInfoId, 
      levelId, 
      programId, 
      areaId, 
      parameterId, 
      subParameterId, 
      indicatorId 
    }
  })
};


