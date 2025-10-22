import apiClient from "../../services/axios/apiClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchNotifications = (userId, signal) =>
  apiClient.get(`/notifications/fetch-notifications`, {
    params: { userId },
    signal
  });

export const patchNotification = (notifId, userId) => 
  apiClient.patch(`/notifications/patch-notification?userId=${userId}&notifId=${notifId}`);
  