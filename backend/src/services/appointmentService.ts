import { v4 as uuidv4 } from 'uuid';
import { query } from '../database/connection.js';

export interface CreateAppointmentPayload {
  patientId: string;
  doctorId: string;
  specialty: string;
  appointmentDate: string;
  durationMinutes?: number;
  consultationType?: 'in-person' | 'online';
  notes?: string;
  cost?: number;
}

export async function createAppointment(payload: CreateAppointmentPayload) {
  const {
    patientId,
    doctorId,
    specialty,
    appointmentDate,
    durationMinutes = 60,
    consultationType = 'in-person',
    notes = '',
    cost = 0,
  } = payload;

  // Check if doctor exists and is available
  const doctorResult = await query('SELECT * FROM doctors WHERE id = $1 AND is_available = TRUE', [doctorId]);

  if (doctorResult.rows.length === 0) {
    throw new Error('Doctor not available');
  }

  // Check for appointment conflicts
  const conflictResult = await query(
    `SELECT id FROM appointments 
     WHERE doctor_id = $1 AND appointment_date = $2 AND status != 'cancelled'`,
    [doctorId, appointmentDate]
  );

  if (conflictResult.rows.length > 0) {
    throw new Error('Time slot not available');
  }

  const appointmentId = uuidv4();

  const result = await query(
    `INSERT INTO appointments 
     (id, patient_id, doctor_id, specialty, appointment_date, duration_minutes, consultation_type, notes, cost, status, payment_status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', 'pending', NOW())
     RETURNING *`,
    [appointmentId, patientId, doctorId, specialty, appointmentDate, durationMinutes, consultationType, notes, cost]
  );

  return result.rows[0];
}

export async function getAppointments(userId: string, role: string) {
  let query_text = '';
  const params: any[] = [];

  if (role === 'patient') {
    query_text = `SELECT a.*, u.full_name as doctor_name, u.email as doctor_email
                  FROM appointments a
                  JOIN doctors d ON a.doctor_id = d.id
                  JOIN users u ON d.id = u.id
                  WHERE a.patient_id = $1
                  ORDER BY a.appointment_date DESC`;
    params.push(userId);
  } else if (role === 'doctor') {
    query_text = `SELECT a.*, u.full_name as patient_name, u.email as patient_email
                  FROM appointments a
                  JOIN patients p ON a.patient_id = p.id
                  JOIN users u ON p.id = u.id
                  WHERE a.doctor_id = $1
                  ORDER BY a.appointment_date DESC`;
    params.push(userId);
  } else {
    throw new Error('Invalid role');
  }

  const result = await query(query_text, params);
  return result.rows;
}

export async function getAppointmentById(appointmentId: string) {
  const result = await query('SELECT * FROM appointments WHERE id = $1', [appointmentId]);

  if (result.rows.length === 0) {
    throw new Error('Appointment not found');
  }

  return result.rows[0];
}

export async function updateAppointmentStatus(appointmentId: string, status: string) {
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];

  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const result = await query(
    'UPDATE appointments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, appointmentId]
  );

  if (result.rows.length === 0) {
    throw new Error('Appointment not found');
  }

  return result.rows[0];
}

export async function updatePaymentStatus(appointmentId: string, paymentStatus: string) {
  const validStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];

  if (!validStatuses.includes(paymentStatus)) {
    throw new Error('Invalid payment status');
  }

  const result = await query(
    'UPDATE appointments SET payment_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [paymentStatus, appointmentId]
  );

  if (result.rows.length === 0) {
    throw new Error('Appointment not found');
  }

  return result.rows[0];
}

export async function cancelAppointment(appointmentId: string) {
  const result = await query(
    `UPDATE appointments 
     SET status = 'cancelled', updated_at = NOW() 
     WHERE id = $1 AND status NOT IN ('completed', 'cancelled')
     RETURNING *`,
    [appointmentId]
  );

  if (result.rows.length === 0) {
    throw new Error('Cannot cancel appointment');
  }

  return result.rows[0];
}

export async function getAvailableDoctors(specialty: string) {
  const result = await query(
    `SELECT d.*, u.email, u.full_name 
     FROM doctors d
     JOIN users u ON d.id = u.id
     WHERE $1 = ANY(d.specializations) AND d.is_available = TRUE`,
    [specialty]
  );

  return result.rows;
}

export async function getDoctorSchedule(doctorId: string, date: string) {
  const result = await query(
    `SELECT appointment_date, duration_minutes FROM appointments
     WHERE doctor_id = $1 AND DATE(appointment_date) = $2 AND status != 'cancelled'
     ORDER BY appointment_date`,
    [doctorId, date]
  );

  return result.rows;
}
