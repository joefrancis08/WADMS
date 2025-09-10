import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addProgramToBeAccredited = (startDate, endDate, levelName, programNames) => {
  return axios.post(`${API_BASE_URL}/accreditation/add-programs-to-be-accredited`, {
    startDate,
    endDate, 
    levelName,
    programNames
  });
};

export const addProgramAreas = (startDate, endDate, levelName, programName, areaNames) => {
  return axios.post(`${API_BASE_URL}/accreditation/add-program-areas`, {
    startDate, 
    endDate, 
    levelName, 
    programName, 
    areaNames
  });
};

export const addAreaParameters = ({ startDate, endDate, levelName, programName, areaName, parameterNames }) => {
  return axios.post(`${API_BASE_URL}/accreditation/add-area-parameters`, {
    startDate,
    endDate,
    levelName,
    programName,
    areaName,
    parameterNames
  });
};

export const addSubParams = ({ startDate, endDate, levelName, programName, areaName, parameterName, subParameterNames }) => {
  return axios.post(`${API_BASE_URL}/accreditation/add-parameter-subparameters`, {
    startDate,
    endDate,
    levelName,
    programName,
    areaName,
    parameterName,
    subParameterNames
  });
};

export const fetchProgramsToBeAccredited = (controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-programs-to-be-accredited`, {
    signal: controller.signal
  });
};

export const fetchAccreditationLevels = (controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-accreditation-levels`, {
    signal: controller.signal
  });
};

export const fetchAccreditationPeriod = (controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-accreditation-period`, {
    signal: controller.signal
  });
};

export const fetchProgramAreas = (startDate, endDate, levelName, programName, controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-program-areas`, {
    params: {
      startDate,
      endDate,
      levelName,
      programName
    }, 
    signal: controller.signal
  });
};

export const fetchAreaParameters = ({ startDate, endDate, levelName, programName, areaName}, controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-area-parameters`, {
    params: {
      startDate,
      endDate,
      levelName,
      programName,
      areaName
    },
    signal: controller.signal
  });
};

export const fetchParamSubparams = ({ startDate, endDate, levelName, programName, areaName, parameterName }, controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-parameter-subparameters`, {
    params: {
      startDate,
      endDate,
      levelName,
      programName,
      areaName,
      parameterName
    },
    signal: controller.signal
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
  
}


