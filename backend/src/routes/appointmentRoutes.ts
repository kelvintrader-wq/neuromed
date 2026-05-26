import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/doctors/available', appointmentController.getAvailableDoctors);
router.get('/doctor/:doctorId/schedule', appointmentController.getDoctorSchedule);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id/status', appointmentController.updateAppointmentStatus);
router.put('/:id/payment', appointmentController.updatePaymentStatus);
router.delete('/:id', appointmentController.cancelAppointment);

export default router;
