import express from 'express';
import { login, validateSession, logout, registerUsersCtrl } from '../controllers/authController.js';
import validarJwt from '../middlewares/validar-jwt.js';

const router = express.Router();

router.post('/login', login);
router.get('/session', validarJwt, validateSession);
router.post('/logout', logout);
router.post('/register', registerUsersCtrl)

export default router;
