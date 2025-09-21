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

export const fetchILP = (controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-info-level-programs`, {
    signal: controller.signal
  });
};

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
    levelId,        // must be numeric id, not string name
    programId,
    areaId,
    parameterId,
    subParameterId, // pass subParameterId from API response
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

export const updateDocName = (docId, newFileName) => {
  return axios.patch(`${API_BASE_URL}/accreditation/rename-document/${docId}`, {
    newFileName
  }, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const deleteProgramToBeAccredited = (startDate, endDate, levelName, programName) => {
  return axios.delete(`${API_BASE_URL}/accreditation/delete-programs-to-be-accredited`, {
    params: {
      startDate,
      endDate,
      levelName,
      programName
    }
  });
};

export const deleteAccreditationPeriod = (startDate, endDate, options = {}) => {
  if (options.isFromPTBA) {
    return axios.delete(`${API_BASE_URL}/accreditation/delete-accreditation-period`, {
      params: {
        startDate,
        endDate
      }
    });
    
  } else {
    return 'Invalid options.';
  }
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

export const deleteDoc = (docId) => {
  return axios.delete(`${API_BASE_URL}/accreditation/delete-document`, {
    params: {
      docId
    }
  });
};


