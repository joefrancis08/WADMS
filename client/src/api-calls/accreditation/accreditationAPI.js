import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addInfoLevelProgram = ({ title, year, accredBody, level, programNames }) => {
  return axios.post(`${API_BASE_URL}/accreditation/add-info-level-programs`, {
    title,
    year,
    accredBody, 
    level,
    programNames
  });
};

export const addProgramAreas = ({ title, year, accredBody, level, program, areaNames }) => {
  return axios.post(`${API_BASE_URL}/accreditation/add-program-areas`, {
    title, 
    year, 
    accredBody, 
    level,
    program, 
    areaNames
  });
};

export const addAreaParameters = ({ title, year, accredBody, level, program, area, parameterNames }) => {
  return axios.post(`${API_BASE_URL}/accreditation/add-area-parameters`, {
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
  return axios.post(`${API_BASE_URL}/accreditation/add-parameter-subparameters`, {
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
  return axios.post(`${API_BASE_URL}/accreditation/add-subparameter-indicators`, {
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
  return axios.post(`${API_BASE_URL}/accreditation/add-document`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addAssignment = async (data = {}, condition = {}) => {
  return axios.post(`${API_BASE_URL}/accreditation/add-assignment`, {
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
  return axios.get(`${API_BASE_URL}/accreditation/fetch-info-level-programs`, {
    signal: controller.signal
  });
};

export const fetchProgramProgress = (signal) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-program-progress`, {
    signal
  });
}

export const fetchAccreditationLevels = (controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-accreditation-levels`, {
    signal: controller.signal
  });
};

export const fetchAreasByLevel = (level, controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-program-areas-by`, {
    params: {
      level
    },
    signal: controller.signal
  });
};

export const fetchParamByAreaId = (areaId, signal) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-area-parameters-by`, {
    params: {
      areaId
    },
    signal
  });
};

export const fetchSubParamByParamId = (parameterId, signal) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-parameter-subparameters-by`, {
    params: {
      parameterId
    },
    signal
  });
};

export const fetchAccreditationPeriod = (controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-accreditation-period`, {
    signal: controller.signal
  });
};

export const fetchProgramAreas = ({ title, year, accredBody, level, program }, controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-program-areas`, {
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
  return axios.get(`${API_BASE_URL}/accreditation/fetch-area-parameters`, {
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
  return axios.get(`${API_BASE_URL}/accreditation/fetch-parameter-subparameters`, {
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
  return axios.get(`${API_BASE_URL}/accreditation/fetch-subparameter-indicators`, {
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

  return axios.get(`${API_BASE_URL}/accreditation/fetch-documents`, {
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
}

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

  return axios.get(`${API_BASE_URL}/accreditation/fetch-documents`, {
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
  return axios.get(`${API_BASE_URL}/accreditation/fetch-assignments`, {
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

export const fetchAccreditationBodies = (signal) => {
  return axios.get(`${API_BASE_URL}/accreditation-body/fetch-accreditation-bodies`, {
    signal
  });
};

export const updateDocName = (docId, newFileName) => {
  return axios.patch(`${API_BASE_URL}/accreditation/rename-document/${docId}`, {
    newFileName
  }, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const deleteAccredInfo = (data = {}, condition = {}) => {
  return axios.delete(`${API_BASE_URL}/accreditation/delete-info-level-program`, {
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
  return axios.delete(`${API_BASE_URL}/accreditation/delete-program-area`, {
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
  
  return axios.delete(`${API_BASE_URL}/accreditation/delete-area-parameter`, {
    params: {
      id,
      parameter
    }
  });
};

export const deletePSPM = (data = {}) => {
  const { pspmId, subParameterId, subParameter } = data;

  return axios.delete(`${API_BASE_URL}/accreditation/delete-param-subparam`, {
    params: {
      pspmId,
      subParameterId,
      subParameter
    }
  });
};

export const deleteDoc = (docId) => {
  return axios.delete(`${API_BASE_URL}/accreditation/delete-document`, {
    params: {
      docId
    }
  });
};

export const deleteAssignment = (data = {}) => {
  const { 
    accredInfoId, levelId, programId, areaId, parameterId, subParameterId, indicatorId, taskForceId 
  } = data;

  return axios.delete(`${API_BASE_URL}/accreditation/delete-assignment`, {
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


