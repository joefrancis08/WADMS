import express from 'express';
import { registerUser, fetchUserById, updateUser, deleteAllUsers, deleteUser, loginUser, checkEmail, userSession, logoutUser, fetchUserByRole, fetchUserByStatus, addUser, confirmEmail, loginController, fetchUsersController } from '../controllers/user/userController.js';
import upload from '../middlewares/uploadProfile.js';
import { fetchUnverifiedUsers } from '../controllers/user/Dean/GET/fetchUsers.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/add-user', upload.single('profilePic'), addUser);
userRouter.post('/confirm-email', confirmEmail);
userRouter.post('/login', loginController);
userRouter.post('/logout', logoutUser);
userRouter.get('/check-email', checkEmail);
userRouter.get('/session', userSession);
userRouter.get('/', fetchUsersController);
userRouter.get('/by-role', fetchUserByRole);
userRouter.get('/unverified-users', fetchUnverifiedUsers);
userRouter.get('/by-status', fetchUserByStatus);
userRouter.get('/:id', fetchUserById);
userRouter.patch('/:uuid', upload.single('newProfilePic'), updateUser);
userRouter.delete('/', deleteAllUsers);
userRouter.delete('/delete-user', deleteUser);

export default userRouter;