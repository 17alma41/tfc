import { useEffect, useState } from 'react';
import { getServices } from '../services/serviceService';
import { getWorkers } from '../services/authService';
import { getAvailableSlots, createReservation } from '../services/bookingService';
import dayjs from 'dayjs';

const BookingPage = () => {
  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getWorkers().then(res => setWorkers(res.data));
    getServices().then(res => setServices(res.data));
  }, []);

  useEffect(() => {
    if (selectedWorker && date && selectedService) {
      const service = services.find(s => s.id === parseInt(selectedService));
      if (!service) return;
      getAvailableSlots(selectedWorker, date, service.duration).then(res => {
        setSlots(res.data);
      });
    }
  }, [selectedWorker, date, selectedService]);

  const handleReservation = async () => {
    try {
      const service = services.find(s => s.id === parseInt(selectedService));
      await createReservation({
        user_name: clientInfo.name,
        user_email: clientInfo.email,
        user_phone: clientInfo.phone,
        service_id: selectedService,
        worker_id: selectedWorker,
        date,
        time: selectedTime
      });
      setMessage('Reserva confirmada 🎉');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error al crear reserva');
    }
  };

  const minDate = dayjs().format('YYYY-MM-DD');

  return (
    <div>
      <h2>Reservar una cita</h2>

      {message && <p>{message}</p>}

      <select onChange={(e) => setSelectedWorker(e.target.value)} value={selectedWorker}>
        <option value="">Selecciona un trabajador</option>
        {workers.map(w => (
          <option key={w.id} value={w.id}>{w.name}</option>
        ))}
      </select>

      <select onChange={(e) => setSelectedService(e.target.value)} value={selectedService}>
        <option value="">Selecciona un servicio</option>
        {services.map(s => (
          <option key={s.id} value={s.id}>
            {s.title} - €{s.price} - {s.duration} min
          </option>
        ))}
      </select>

      <input
        type="date"
        min={minDate}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {slots.length > 0 && (
        <div>
          <h4>Horarios disponibles:</h4>
          {slots.map((slot, i) => (
            <button
              key={i}
              onClick={() => setSelectedTime(slot)}
              style={{ margin: '0.25rem', background: selectedTime === slot ? 'lightblue' : '' }}
            >
              {slot}
            </button>
          ))}
        </div>
      )}

      <h4>Tus datos</h4>
      <input placeholder="Nombre" onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })} />
      <input placeholder="Correo" onChange={e => setClientInfo({ ...clientInfo, email: e.target.value })} />
      <input placeholder="Teléfono" onChange={e => setClientInfo({ ...clientInfo, phone: e.target.value })} />

      <button onClick={handleReservation} disabled={!selectedTime}>Reservar</button>
    </div>
  );
};

export default BookingPage;
