import express from 'express';
import { registerUser, fetchUserById, fetchUsers, updateUser, deleteUsers, deleteUser, loginUser, checkEmail } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/check-email', checkEmail);
router.post('/login', loginUser);
router.get('/', fetchUsers);
router.get('/:id', fetchUserById);
router.put('/:id', updateUser);
router.delete('/', deleteUsers);
router.delete('/:id', deleteUser);

export default router;