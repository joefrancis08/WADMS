import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addProgramToBeAccredited = (startDate, endDate, levelName, programNames) => {
  return axios.post(`${API_BASE_URL}/accreditation/add-program-to-accredit`, {
    startDate,
    endDate, 
    levelName,
    programNames
  });
}