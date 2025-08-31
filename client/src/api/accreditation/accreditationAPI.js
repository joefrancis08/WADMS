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
