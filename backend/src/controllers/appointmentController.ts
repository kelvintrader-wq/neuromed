import { Request, Response } from 'express';
import * as appointmentService from '../services/appointmentService.js';

export async function createAppointment(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { doctorId, specialty, appointmentDate, durationMinutes, consultationType, notes, cost } = req.body;

    if (!doctorId || !specialty || !appointmentDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const appointment = await appointmentService.createAppointment({
      patientId: req.user.userId,
      doctorId,
      specialty,
      appointmentDate,
      durationMinutes,
      consultationType,
      notes,
      cost,
    });

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    console.error('[Appointments] Create error:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAppointments(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const appointments = await appointmentService.getAppointments(req.user.userId, req.user.role);

    res.json({
      success: true,
      appointments,
    });
  } catch (error: any) {
    console.error('[Appointments] Get list error:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAppointmentById(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const appointment = await appointmentService.getAppointmentById(req.params.id);

    res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    console.error('[Appointments] Get by ID error:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateAppointmentStatus(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Missing status' });
    }

    const appointment = await appointmentService.updateAppointmentStatus(req.params.id, status);

    res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    console.error('[Appointments] Update status error:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function updatePaymentStatus(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ error: 'Missing payment status' });
    }

    const appointment = await appointmentService.updatePaymentStatus(req.params.id, paymentStatus);

    res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    console.error('[Appointments] Update payment error:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function cancelAppointment(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const appointment = await appointmentService.cancelAppointment(req.params.id);

    res.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    console.error('[Appointments] Cancel error:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function getAvailableDoctors(req: Request, res: Response) {
  try {
    const { specialty } = req.query;

    if (!specialty) {
      return res.status(400).json({ error: 'Missing specialty' });
    }

    const doctors = await appointmentService.getAvailableDoctors(specialty as string);

    res.json({
      success: true,
      doctors,
    });
  } catch (error: any) {
    console.error('[Appointments] Get doctors error:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function getDoctorSchedule(req: Request, res: Response) {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ error: 'Missing doctorId or date' });
    }

    const schedule = await appointmentService.getDoctorSchedule(doctorId as string, date as string);

    res.json({
      success: true,
      schedule,
    });
  } catch (error: any) {
    console.error('[Appointments] Get schedule error:', error);
    res.status(400).json({ error: error.message });
  }
}
