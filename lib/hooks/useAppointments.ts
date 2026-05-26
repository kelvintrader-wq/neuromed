'use client'

import { useState, useCallback } from 'react';
import apiClient from '@/lib/api/client';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  specialty: string;
  appointmentDate: string;
  durationMinutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  consultationType: 'in-person' | 'online';
  cost: number;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  meetingLink?: string;
}

export interface CreateAppointmentPayload {
  doctorId: string;
  specialty: string;
  appointmentDate: string;
  durationMinutes?: number;
  consultationType?: 'in-person' | 'online';
  notes?: string;
  cost?: number;
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/api/appointments');

      if (response.data.success) {
        setAppointments(response.data.appointments || []);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch appointments';
      setError(errorMessage);
      console.error('[useAppointments] Fetch error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAppointment = useCallback(async (payload: CreateAppointmentPayload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post('/api/appointments', payload);

      if (response.data.success) {
        setAppointments((prev) => [response.data.appointment, ...prev]);
        return { success: true, appointment: response.data.appointment };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create appointment';
      setError(errorMessage);
      console.error('[useAppointments] Create error:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAppointment = useCallback(async (appointmentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(`/api/appointments/${appointmentId}`);

      if (response.data.success) {
        return { success: true, appointment: response.data.appointment };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch appointment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAppointmentStatus = useCallback(async (appointmentId: string, status: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.put(`/api/appointments/${appointmentId}/status`, { status });

      if (response.data.success) {
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === appointmentId ? response.data.appointment : apt))
        );
        return { success: true, appointment: response.data.appointment };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update appointment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelAppointment = useCallback(async (appointmentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.delete(`/api/appointments/${appointmentId}`);

      if (response.data.success) {
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt))
        );
        return { success: true };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to cancel appointment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailableDoctors = useCallback(async (specialty: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/api/appointments/doctors/available', {
        params: { specialty },
      });

      if (response.data.success) {
        return { success: true, doctors: response.data.doctors };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch doctors';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getDoctorSchedule = useCallback(async (doctorId: string, date: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/api/appointments/doctor/' + doctorId + '/schedule', {
        params: { date },
      });

      if (response.data.success) {
        return { success: true, schedule: response.data.schedule };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch schedule';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    getAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    getAvailableDoctors,
    getDoctorSchedule,
  };
}
