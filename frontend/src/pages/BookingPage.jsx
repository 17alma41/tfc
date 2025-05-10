import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getServices } from '../services/serviceService';
import { getPublicWorkers } from '../services/userService';
import {
  getAvailableSlots,
  createReservation,
  getClientReservations
} from '../services/bookingService';
import dayjs from 'dayjs';

const BookingPage = () => {
  const { user } = useAuth();

  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [message, setMessage] = useState('');
  const [clientReservations, setClientReservations] = useState([]);

  const minDate = dayjs().format('YYYY-MM-DD');

  // Regex genérico para validar teléfono (+ opcional y 9-15 dígitos)
  const phoneRegex = /^\+?\d{9,15}$/;

  useEffect(() => {
    getPublicWorkers()
      .then(res => setWorkers(res.data))
      .catch(err => console.error('Error al cargar trabajadores públicos:', err));
    getServices()
      .then(res => setServices(res.data))
      .catch(err => console.error('Error al cargar servicios:', err));
  }, []);

  useEffect(() => {
    if (selectedWorker && date && selectedService) {
      const svc = services.find(s => s.id === +selectedService);
      if (svc) {
        getAvailableSlots(selectedWorker, date, svc.duration)
          .then(res => setSlots(res.data))
          .catch(err => console.error('Error al obtener slots:', err));
      }
    } else {
      setSlots([]);
    }
  }, [selectedWorker, date, selectedService, services]);

  useEffect(() => {
    if (user?.role === 'cliente') {
      getClientReservations()
        .then(res => setClientReservations(res.data))
        .catch(err => {
          console.error('Error al cargar tus reservas:', err);
          setClientReservations([]);
        });
    }
  }, [user]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    if (!phoneRegex.test(value)) {
      setPhoneError('Introduce un teléfono válido (9-15 dígitos, opcional +).');
    } else {
      setPhoneError('');
    }
  };

  const handleReservation = async () => {
    // Validación adicional antes de enviar
    if (!phone) {
      setMessage('El teléfono es obligatorio.');
      return;
    }
    if (phoneError) {
      setMessage(phoneError);
      return;
    }
    try {
      await createReservation({
        user_name:  user.name,
        user_email: user.email,
        user_phone: phone,
        service_id: selectedService,
        worker_id: selectedWorker,
        date,
        time: selectedTime
      });
      setMessage('Reserva confirmada 🎉');

      // refrescar “mis reservas”
      if (user?.role === 'cliente') {
        const res = await getClientReservations();
        setClientReservations(res.data);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Error al crear reserva');
    }
  };

  const now = dayjs();

  return (
    <div>
      <h2>Reservar una cita</h2>
      {message && <p>{message}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Trabajador:
          <select
            value={selectedWorker}
            onChange={e => setSelectedWorker(e.target.value)}
          >
            <option value="">-- elige uno --</option>
            {workers.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          Servicio:
          <select
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
          >
            <option value="">-- elige uno --</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>
                {s.title} — €{s.price} — {s.duration} min
              </option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          Fecha:
          <input
            type="date"
            min={minDate}
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>
      </div>

      {slots.length > 0 ? (
        <div>
          <h4>Horarios disponibles</h4>
          {slots.map(slot => (
            <button
              key={slot}
              onClick={() => setSelectedTime(slot)}
              style={{
                margin: '0.25rem',
                background: selectedTime === slot ? 'lightblue' : undefined
              }}
            >
              {slot}
            </button>
          ))}
        </div>
      ) : (
        selectedWorker && date && selectedService && (
          <p>No hay horas disponibles para esa combinación.</p>
        )
      )}

      <hr />

      <h3>Tus datos</h3>
      <input type="text" value={user?.name || ''} readOnly style={{ marginRight: '0.5rem' }} />
      <input type="email" value={user?.email || ''} readOnly style={{ marginRight: '0.5rem' }} />
      <input
        type="tel"
        placeholder="Tu teléfono"
        value={phone}
        onChange={handlePhoneChange}
        style={{ marginRight: '0.5rem' }}
      />
      {phoneError && <div style={{ color: 'red', marginBottom: '0.5rem' }}>{phoneError}</div>}
      <button onClick={handleReservation} disabled={!selectedTime || !phone || !!phoneError}>
        Reservar
      </button>
    </div>
  );
};

export default BookingPage;
