import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',  
  withCredentials: false,           
});


export const getAvailableSlots = (workerId, date, serviceDuration) => {
  return api.get('/api/reservations/available-slots', {
    params: {
      worker_id: workerId,
      date,
      service_duration: serviceDuration
    }
  });
};

// Crea la reserva
export const createReservation = (data) => {
  return api.post('/api/reservations', data);
};
