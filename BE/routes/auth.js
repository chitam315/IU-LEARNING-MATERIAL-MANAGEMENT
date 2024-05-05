import express from "express";
const router = express.Router();
// const bodyParser = require('body-parser')
// const jwt = require('jsonwebtoken')
import jwtAuth from "../app/middlewares/jwtAuth.js";
import isAdmin from '../app/middlewares/isAdmin.js'

import authController from '../app/controllers/authController.js'

router.get('/all-teachers',jwtAuth,isAdmin,authController.getAllTeacher)
router.get('/all-user-id',jwtAuth,isAdmin,authController.getAllUserId)
router.get("/all-users",jwtAuth,isAdmin,authController.getAllUser)
router.post("/login", authController.userLogin)
router.post("/register",jwtAuth,isAdmin, authController.userRegister)
router.post("/update-password", jwtAuth, authController.updatePassword);
router.post("/token", authController.refreshToken)
router.put("/update-email", jwtAuth, authController.updateEmail);
router.put("/update-information",jwtAuth,isAdmin,authController.updateInformation)
router.put('/update-personal',jwtAuth,authController.updatePersonalInformation)
router.delete("/delete-user/:username",jwtAuth,isAdmin,authController.deleteUser)
router.post('/send-email',authController.sendEmail)
router.post('/change-password-with-code',authController.changePasswordWithCode)
router.post('/add-to-wishlist',jwtAuth,authController.addToWishList)
router.get('/get-wishlist',jwtAuth,authController.readWishList)
router.delete('/remove-from-wishlist/:id',jwtAuth,authController.removeFromWishList)
router.get("/people",jwtAuth,authController.getPeople)
export default router;