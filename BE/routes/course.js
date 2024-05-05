import express from 'express';
const router = express.Router();

import courseController from '../app/controllers/courseController.js';
import jwtAuth from '../app/middlewares/jwtAuth.js';
import isAdmin from '../app/middlewares/isAdmin.js'
import isTeacher from '../app/middlewares/isTeacher.js'

router.post('/create-course',jwtAuth,isAdmin,courseController.createCourse)
router.get('/:id',jwtAuth,courseController.getCourse)
router.put('/:id/update',jwtAuth,isTeacher,courseController.updateCourse)
router.put('/:id/change-teacher',jwtAuth,isAdmin,courseController.changeTeacher)
router.get('/',jwtAuth,courseController.getAllCourse)

router.delete('/:id/delete',jwtAuth,isAdmin,courseController.deleteCourse)

export default router