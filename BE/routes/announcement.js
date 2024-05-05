import express from 'express';
const router = express.Router();
import announcementController from '../app/controllers/announcementController.js'
import jwtAuth from '../app/middlewares/jwtAuth.js';
import isAdmin from '../app/middlewares/isAdmin.js';

router.get('/',jwtAuth,announcementController.getAnnouncements)
router.post('/',jwtAuth,isAdmin,announcementController.createAnnouncement)
router.delete('/:id',jwtAuth,isAdmin,announcementController.deleteAnnouncements)


export default router