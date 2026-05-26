import { createClient } from '@/lib/supabase/server'

export async function getPatientAppointments(patientId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
      *,
      doctor:doctor_id(id, full_name, profile_image_url),
      patient:patient_id(id, full_name)
    `
    )
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: false })

  if (error) throw error
  return data
}

export async function getDoctorAppointments(doctorId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
      *,
      doctor:doctor_id(id, full_name),
      patient:patient_id(id, full_name, profile_image_url)
    `
    )
    .eq('doctor_id', doctorId)
    .order('appointment_date', { ascending: true })

  if (error) throw error
  return data
}

export async function getAvailableDoctors(specialty: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('doctors')
    .select('id, full_name, profile_image_url, specializations, hourly_rate, is_available')
    .contains('specializations', [specialty])
    .eq('is_available', true)

  if (error) throw error
  return data
}

export async function cancelAppointment(appointmentId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', appointmentId)

  if (error) throw error
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string = 'info',
  relatedId?: string
) {
  const supabase = createClient()

  const { error } = await supabase.from('notifications').insert([
    {
      user_id: userId,
      title,
      message,
      type,
      related_id: relatedId,
    },
  ])

  if (error) throw error
}
