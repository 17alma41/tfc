import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  
  withCredentials: true,           
});


export const getAvailableSlots = (workerId, date, serviceDuration) => {
  return api.get('reservations/available-slots', {
    params: {
      worker_id: workerId,
      date,
      service_duration: serviceDuration
    }
  });
};

// Crea la reserva
export const createReservation = (data) => {
  return api.post('/reservations', data);
};

// Cancela la reserva
export const cancelClientReservation = (id) => {
  return api.delete(`/reservations/${id}`);
};

// Obtiene las reservas del trabajador logueado
export const getClientReservations = () =>
  api.get('/reservations/client');