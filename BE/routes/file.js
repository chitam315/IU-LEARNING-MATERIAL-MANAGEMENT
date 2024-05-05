import express from 'express';
const router = express.Router();
import fileController from '../app/controllers/fileController.js'
import jwtAuth from '../app/middlewares/jwtAuth.js';
import isTeacher from '../app/middlewares/isTeacher.js'


router.post('/create-file',jwtAuth,isTeacher,fileController.uploadFile)
router.put('/edit',jwtAuth,isTeacher,fileController.uploadFile)
router.delete('/:id',jwtAuth,isTeacher,fileController.deleteFile)
router.get('/all',jwtAuth,fileController.getAllFile)
router.get('/:id',jwtAuth,fileController.getFileById)

export default router