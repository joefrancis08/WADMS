import express from 'express';
import { createUser, fetchUserById, fetchUsers, updateUser, deleteUsers, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', createUser);
router.get('/', fetchUsers);
router.get('/:id', fetchUserById);
router.put('/:id', updateUser);
router.delete('/', deleteUsers);
router.delete('/:id', deleteUser)

export default router;