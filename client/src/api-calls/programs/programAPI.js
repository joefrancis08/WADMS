import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchPrograms = (controller) => {
  return axios.get(`${API_BASE_URL}/programs/fetch-programs`, {
    signal: controller.signal
  });
};

export const fetchProgramsToBeAccredited = (controller) => {
  return axios.get(`${API_BASE_URL}/accreditation/fetch-programs-to-be-accredited`, {
    signal: controller.signal
  });
};