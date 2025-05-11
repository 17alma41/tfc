import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './WelcomePage.module.css';
import heroImg from '../../assets/hero.jpg';

export default function WelcomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.logo}>Hair Salon</h1>
        <nav className={styles.navLinks}>
          {/* Si NO está autenticado, se muestra Login y Register */}
          {!isAuthenticated && (
            <>
              <Link to="login">Login</Link>
              <Link to="register">Register</Link>
            </>
          )}

          {/* Si está autenticado y es superadmin */}
          {isAuthenticated && user.role === 'superadmin' && (
            <Link to="/dashboard/superadmin">Mi panel Super Admin</Link>
          )}

          {/* Si está autenticado y es admin */}
          {isAuthenticated && user.role === 'admin' && (
            <Link to="/dashboard/admin">Mi panel Admin</Link>
          )}

          {/* Si está autenticado y es trabajador */}
          {isAuthenticated && user.role === 'trabajador' && (
            <Link to="/dashboard/worker">Mi panel Trabajador</Link>
          )}

          {/* Si está autenticado y es cliente */}
          {isAuthenticated && user.role === 'cliente' && (
            <>
              <Link to="/dashboard/client">Mi panel</Link>
              <Link to="reservar">Reservar</Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <img src={heroImg} alt="Barber background" />
        <h2 className={styles.heroTitle}>Hair Salon</h2>
      </section>

      {/* Intro */}
      <section className={styles.intro}>
        <p className={styles.introText}>
          Somos un grupo de trabajadoras y trabajadores que damos los mejores
          servicios a nuestros clientes para que queden totalmente{' '}
          <span style={{ color: 'var(--orange)' }}>satisfechos</span>.
        </p>
        <button className={styles.introBtn}>Nuestro trabajo</button>
      </section>

      {/* Reserva CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Reserva tu cita</h2>
        <Link to="/reservar">
          <button className={styles.ctaBtn}>Reservar</button>
        </Link>
      </section>

      {/* Contacto */}
      <section className={styles.contact}>
        <h3 className={styles.contactTitle}>Contáctanos</h3>
        <p className={styles.contactText}>
          Si ha tenido alguna incidencia o quiere trabajar con nosotros,
          háganoslo saber,{' '}
          <span style={{ color: 'var(--orange)' }}>te ayudaremos</span>.
        </p>
        <form>
          <input
            type="text"
            placeholder="Nombre"
            required
            className={styles.contactInput}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className={styles.contactInput}
          />
          <textarea
            placeholder="Motivo"
            rows="3"
            required
            className={styles.contactTextarea}
          />
          <button type="submit" className={styles.contactBtn}>
            Enviar
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <nav className={styles.footerNav}>
          <Link to="/">Inicio</Link>
          <Link to="/">Nuestro trabajo</Link>
          <Link to="/reservar">Reservar</Link>
          <Link to="/">Contacto</Link>
        </nav>
        <p className={styles.footerText}>
          ©2025 Álvaro TFC &nbsp;|&nbsp;
          <Link to="/">Terms</Link> &nbsp;|&nbsp;
          <Link to="/">Privacy</Link> &nbsp;|&nbsp;
          <Link to="/">Cookies</Link>
        </p>
      </footer>
      <Outlet />
    </div>
);
}