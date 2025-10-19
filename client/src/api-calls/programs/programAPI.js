import apiClient from "../../services/axios/apiClient";

export const fetchPrograms = (controller) => {
  return apiClient.get(`/programs/fetch-programs`, {
    signal: controller.signal
  });
};

export const fetchProgramsToBeAccredited = (controller) => {
  return apiClient.get(`/accreditation/fetch-programs-to-be-accredited`, {
    signal: controller.signal
  });
};