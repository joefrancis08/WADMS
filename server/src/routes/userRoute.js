import express from 'express';
import { registerUser, fetchUserById, updateUser, deleteAllUsers, deleteUser, loginUser, checkEmail, userSession, logoutUser, fetchUserByRole, fetchUserByStatus, addUser, confirmEmail, loginController, fetchUsersController, updateUserRole } from '../controllers/user/userController.js';
import upload from '../middlewares/uploadProfile.js';
import { fetchUnverifiedUsers } from '../controllers/user/Dean/GET/fetchUsers.js';
import fetchAccessToken from '../controllers/access-token/GET/fetchAccessToken.js';
import verifyToken from '../controllers/access-token/POST/verifyToken.js';
import generateNewToken from '../controllers/access-token/PATCH/generateNewToken.js';
import shareToken from '../controllers/access-token/POST/shareToken.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/add-user', upload.single('profilePic'), addUser);
userRouter.post('/confirm-email', confirmEmail);
userRouter.post('/login', loginController);
userRouter.post('/verify-token', verifyToken);
userRouter.post('/share-token', shareToken);
userRouter.post('/logout', logoutUser);
userRouter.get('/check-email', checkEmail);
userRouter.get('/session', userSession);
userRouter.get('/', fetchUsersController);
userRouter.get('/by-role', fetchUserByRole);
userRouter.get('/unverified-users', fetchUnverifiedUsers);
userRouter.get('/access-token', fetchAccessToken);
userRouter.get('/by-status', fetchUserByStatus);
userRouter.get('/:id', fetchUserById);
userRouter.patch('/generate-new-token', generateNewToken);
userRouter.patch('/:uuid', upload.single('newProfilePic'), updateUser);
userRouter.patch('/role/:uuid', updateUserRole);
userRouter.delete('/', deleteAllUsers);
userRouter.delete('/delete-user', deleteUser);

export default userRouter;