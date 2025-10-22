import express from 'express';
import { authorize } from "../middlewares/auth/authMiddleware.js";
import allowedRoles from "./obj/allowedRoles.js";
import fetchNotifications from '../controllers/notification/GET/fetchNotifications.js';
import patchNotification from '../controllers/notification/PATCH/patchNotification.js';

const { D, M, C, I, A } = allowedRoles();

const notificationRouter = express.Router();

notificationRouter.get('/fetch-notifications', authorize([D, C, M, I, A]), fetchNotifications);

notificationRouter.patch('/patch-notification', authorize([D, M, C, I, A]), patchNotification);

export default notificationRouter;

