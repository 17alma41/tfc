import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getServices } from '../services/serviceService';
import { getPublicWorkers } from '../services/userService';
import {
  getAvailableSlots,
  createReservation,
  getClientReservations
} from '../services/bookingService';
import dayjs from 'dayjs';
import styles from './BookingPage.module.css';

// Tus imágenes de carrusel
import photo1 from '../../assets/carousel1.jpg';
import photo2 from '../../assets/carousel2.jpg';
import photo3 from '../../assets/carousel3.jpg';

export default function BookingPage() {
  const { user } = useAuth();

  // Flujo de modals
  const [modalStep, setModalStep]       = useState(0);
  const [modalWorker, setModalWorker]   = useState(null);
  const [modalService, setModalService] = useState(null);
  const [modalDate, setModalDate]       = useState(dayjs().format('YYYY-MM-DD'));
  const [slots, setSlots]               = useState([]);
  const [selectedTime, setSelectedTime] = useState('');

  // Datos de cliente y errores
  const [phone, setPhone]         = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Éxito de reserva
  const [showSuccess, setShowSuccess] = useState(false);

  // Datos maestros
  const [workers, setWorkers]   = useState([]);
  const [services, setServices] = useState([]);

  // Carrusel
  const photos = [photo1, photo2, photo3];
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentSlide(i => (i + 1) % photos.length);
    }, 5000);
    return () => clearInterval(iv);
  }, [photos.length]);

  // Scroll to top helper
  const handleRefreshClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Carga inicial
  useEffect(() => {
    getPublicWorkers().then(r => setWorkers(r.data));
    getServices().then(r => setServices(r.data));
    if (user?.role === 'cliente') {
      getClientReservations().then(() => {});
    }
  }, [user]);

  // Carga de slots en paso 1
  useEffect(() => {
    if (modalStep === 1 && modalWorker && modalService && modalDate) {
      const svc = services.find(s => s.id === modalService);
      getAvailableSlots(modalWorker, modalDate, svc.duration)
        .then(r => setSlots(r.data))
        .catch(console.error);
    } else {
      setSlots([]);
    }
  }, [modalStep, modalWorker, modalService, modalDate, services]);

  // Abrir modal paso 1
  const openStep1 = svcId => {
    setModalService(svcId);
    setModalWorker(null);
    setSelectedTime('');
    setModalDate(dayjs().format('YYYY-MM-DD'));
    setErrorMessage('');
    setModalStep(1);
  };

  // Validar teléfono
  const onPhoneChange = e => {
    const v = e.target.value;
    setPhone(v);
    setPhoneError(!/^\+?\d{9,15}$/.test(v)
      ? 'Teléfono inválido (9–15 dígitos).'
      : '');
  };

  // Confirmar reserva paso 2
  const handleConfirm = async () => {
    if (!phone) {
      setPhoneError('El teléfono es obligatorio.');
      return;
    }
    if (phoneError) return;
    try {
      await createReservation({
        user_name:  user.name,
        user_email: user.email,
        user_phone: phone,
        service_id: modalService,
        worker_id: modalWorker,
        date: modalDate,
        time: selectedTime
      });
      setModalStep(0);
      setShowSuccess(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Error al reservar');
    }
  };

  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>Hair Salon</Link>
        <Link to="/dashboard/client" className={styles.panelLink}>Mi Panel</Link>
      </header>

      {/* Contenido */}
      <div className={styles.container}>
        {/* Hero + Carrusel */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Reserva tu cita</h1>
          <div className={styles.carousel}>
            <div
              className={styles.slides}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {photos.map((src, i) => (
                <div className={styles.slide} key={i}>
                  <img src={src} alt={`Slide ${i+1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trabajadores (solo estética) */}
        <section className={styles.workersSection}>
          <h2>Trabajadores</h2>
          <div className={styles.workersGrid}>
            {workers.map(w => (
              <div key={w.id} className={styles.workerCard}>
                <span className={styles.workerIcon}>👤</span>
                <span className={styles.workerName}>{w.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Servicios */}
        <section className={styles.servicesSection}>
          <h2>Servicios</h2>
          <ul className={styles.servicesList}>
            {services.map(s => (
              <li key={s.id} className={styles.serviceItem}>
                <div className={styles.serviceDetails}>
                  <p className={styles.serviceTitle}>{s.title}</p>
                  <p className={styles.serviceDescription}>{s.description}</p>
                </div>
                <p className={styles.duration}>{s.duration} min</p>
                <p className={styles.price}>€{s.price}</p>
                <button
                  className={styles.reserveButton}
                  onClick={() => openStep1(s.id)}
                >
                  Reservar
                </button>
              </li>
            ))}
          </ul>
          {errorMessage && (
            <p style={{ color: '#e53e3e', textAlign: 'center' }}>{errorMessage}</p>
          )}
        </section>
      </div>

      {/* Modal Paso 1 */}
      {modalStep === 1 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setModalStep(0)}
            >×</button>
            <h2 className={styles.modalTitle}>Disponibilidad</h2>

            <div className={styles.modalFormGroup}>
              <label>Empleado:</label>
              <select
                className={styles.modalSelect}
                value={modalWorker || ''}
                onChange={e => setModalWorker(e.target.value)}
              >
                <option value="">-- elige uno --</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.modalFormGroup}>
              <label>Fecha:</label>
              <input
                type="date"
                min={dayjs().format('YYYY-MM-DD')}
                className={styles.modalDate}
                value={modalDate}
                onChange={e => setModalDate(e.target.value)}
              />
            </div>

            <div className={styles.slotsContainer}>
              {slots.map(slot => (
                <button
                  key={slot}
                  className={`${styles.slotButton} ${
                    selectedTime === slot ? styles.selectedSlot : ''
                  }`}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </button>
              ))}
              {slots.length === 0 && modalWorker && modalDate && (
                <p>No hay horas para ese día.</p>
              )}
            </div>

            {modalService && (
              <div className={styles.serviceSummary}>
                <div>
                  <p className={styles.serviceSummaryTitle}>
                    {services.find(s => s.id === modalService).title}
                  </p>
                  <p className={styles.serviceSummaryDesc}>
                    {services.find(s => s.id === modalService).description}
                  </p>
                </div>
                <p className={styles.serviceSummaryDuration}>
                  {services.find(s => s.id === modalService).duration} min
                </p>
                <p className={styles.serviceSummaryPrice}>
                  €{services.find(s => s.id === modalService).price}
                </p>
              </div>
            )}

            <button
              className={styles.continueButton}
              disabled={!modalWorker || !modalDate || !selectedTime}
              onClick={() => setModalStep(2)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Modal Paso 2 */}
      {modalStep === 2 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setModalStep(0)}
            >×</button>
            <h2 className={styles.modalTitle}>Tus datos</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nombre:</label>
              <input
                className={styles.formInput}
                type="text"
                value={user.name}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email:</label>
              <input
                className={styles.formInput}
                type="email"
                value={user.email}
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Teléfono:</label>
              <input
                className={styles.formInput}
                type="tel"
                placeholder="+34 600 123 456"
                value={phone}
                onChange={onPhoneChange}
              />
            </div>
            {phoneError && (
              <div className={styles.errorText}>{phoneError}</div>
            )}
            <button
              className={styles.confirmButton}
              disabled={
                !modalWorker ||
                !modalDate ||
                !selectedTime ||
                !phone ||
                !!phoneError
              }
              onClick={handleConfirm}
            >
              Confirmar y Reservar
            </button>
          </div>
        </div>
      )}

      {/* Modal Éxito */}
      {showSuccess && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>¡Reserva confirmada 🎉!</h2>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', margin: '1rem 0' }}>
              Hemos registrado tu cita para el {modalDate} a las {selectedTime}.
            </p>
            <button
              className={styles.confirmButton}
              onClick={() => setShowSuccess(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <nav className={styles.footerNav}>
          <Link to="/" onClick={handleRefreshClick}>Inicio</Link>
          <Link to="/">Nuestro trabajo</Link>
          <Link to="/reservar" onClick={handleRefreshClick}>Reservar</Link>
          <Link to="/">Contacto</Link>
        </nav>
        <p className={styles.footerText}>
          ©2025 Álvaro TFC &nbsp;|&nbsp;
          <Link to="/terms">Terms</Link> &nbsp;|&nbsp;
          <Link to="/privacy">Privacy</Link> &nbsp;|&nbsp;
          <Link to="/cookies">Cookies</Link>
        </p>
      </footer>
    </>
  );
}
