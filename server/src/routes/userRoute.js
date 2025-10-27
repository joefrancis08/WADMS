import express from 'express';
import { registerUser, fetchUserById, updateUser, deleteAllUsers, deleteUser, loginUser, checkEmail, userSession, logoutUser, fetchUserByRole, fetchUserByStatus, addUser, confirmEmail, loginController, fetchUsersController, updateUserRole } from '../controllers/user/userController.js';
import upload from '../middlewares/uploadProfile.js';
import { fetchUnverifiedUsers } from '../controllers/user/Dean/GET/fetchUsers.js';
import fetchAccessToken from '../controllers/access-token/GET/fetchAccessToken.js';
import generateNewToken from '../controllers/access-token/PATCH/generateNewToken.js';
import shareToken from '../controllers/access-token/POST/shareToken.js';
import verifyToken from '../controllers/access-token/POST/verifyToken.js';
import { authorize } from '../middlewares/auth/authMiddleware.js';
import allowedRoles from './obj/allowedRoles.js';
import fetchUserStatus from '../controllers/user/Dean/GET/fetchUserStatus.js';
import updateUserStatus from '../controllers/user/Dean/PATCH/updateUserStatus.js';

const { D, M, C, I, A } = allowedRoles();

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/add-user', authorize([D]), upload.single('profilePic'), addUser);
userRouter.post('/confirm-email', confirmEmail);
userRouter.post('/login', loginController);
userRouter.post('/verify-token', verifyToken);
userRouter.post('/share-token', shareToken);
userRouter.post('/logout', logoutUser);
userRouter.get('/check-email', checkEmail);
userRouter.get('/fetch-user-status', fetchUserStatus);
userRouter.get('/session', userSession);
userRouter.get('/', authorize([D, C, M]), fetchUsersController);
userRouter.get('/by-role', authorize([D, C, M]), fetchUserByRole);
userRouter.get('/unverified-users', authorize([D]), fetchUnverifiedUsers);
userRouter.get('/access-token', authorize([D]), fetchAccessToken);
userRouter.get('/by-status', authorize([D]), fetchUserByStatus);
userRouter.get('/:id', authorize([D]), fetchUserById);
userRouter.patch('/generate-new-token', authorize([D]), generateNewToken);
userRouter.patch('/:uuid', authorize([D, C, M, A, I]), upload.single('newProfilePic'), updateUser);
userRouter.patch('/role/:uuid', authorize([D]), updateUserRole);
userRouter.patch('/status/:uuid', updateUserStatus);
userRouter.delete('/', authorize([D]), deleteAllUsers);
userRouter.delete('/delete-user', authorize([D]), deleteUser);

export default userRouter;