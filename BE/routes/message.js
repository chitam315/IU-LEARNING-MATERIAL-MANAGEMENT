import express from 'express';
const router = express.Router();
import messageController from '../app/controllers/messageController.js'
import jwtAuth from '../app/middlewares/jwtAuth.js';
import isAdmin from '../app/middlewares/isAdmin.js';

router.get('/:id',jwtAuth,messageController.getAllMessage)


export default router