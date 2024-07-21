import express from 'express';
import { deleteAppointment, getAllAppointments, postAppointment, updateAppointment } from '../controller/appointmentController.js';
import { isAdminAuthenticated,isPatientAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/newpost',isPatientAuthenticated,postAppointment);

router.get('/getAll',isAdminAuthenticated,getAllAppointments);

router.put('/update/:id',isAdminAuthenticated,updateAppointment);

router.delete('/delete/:id',isAdminAuthenticated,deleteAppointment);

export default router;