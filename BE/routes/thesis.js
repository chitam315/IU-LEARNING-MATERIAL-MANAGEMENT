import express from 'express';
const router = express.Router();
import thesisController from '../app/controllers/thesisController.js'
import jwtAuth from '../app/middlewares/jwtAuth.js';
import isAdmin from '../app/middlewares/isAdmin.js';

router.post('/',jwtAuth,isAdmin,thesisController.uploadThesis)
router.delete('/:id',jwtAuth,isAdmin,thesisController.deleteThesis)
router.get('/',jwtAuth,thesisController.getAllThesis)
router.put('/update',jwtAuth,isAdmin,thesisController.updateThesis)
router.get('/:id',jwtAuth,thesisController.getThesisById)
export default router