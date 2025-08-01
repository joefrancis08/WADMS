import express from 'express';
import { registerUser, fetchUserById, fetchUsers, updateUser, deleteUsers, deleteUser, loginUser, checkEmail, userSession, logoutUser, fetchUserByRole, handleUpdateUserRole, fetchUserByStatus } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/check-email', checkEmail);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.get('/session', userSession);
userRouter.get('/', fetchUsers);
userRouter.get('/by-role', fetchUserByRole);
userRouter.get('/by-status', fetchUserByStatus);
userRouter.get('/:id', fetchUserById);
userRouter.put('/:id', updateUser);
userRouter.patch('/:uuid/role', handleUpdateUserRole);
userRouter.delete('/', deleteUsers);
userRouter.delete('/:uuid', deleteUser);

export default userRouter;