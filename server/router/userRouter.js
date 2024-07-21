import express from 'express';
import { addDoctor, addNewAdmin, getAdminLogout, getAllDoctors, getPatientLogout, getUserDetails, login, patientRegister } from '../controller/userController.js'
import { isAdminAuthenticated, isPatientAuthenticated } from '../middlewares/auth.js'

const router = express.Router();

router.post('/patient/register',patientRegister);

router.post('/login',login);

router.post('/admin/addnew',isAdminAuthenticated,addNewAdmin);

router.get('/doctors',getAllDoctors);

router.get('/admin/user',isAdminAuthenticated,getUserDetails);

router.get('/patient/user',isPatientAuthenticated, getUserDetails);

router.get('/admin/logout',isAdminAuthenticated,getAdminLogout);

router.get('/patient/logout', isPatientAuthenticated, getPatientLogout);

router.post('/adddoctor',isAdminAuthenticated,addDoctor)

export default router;
