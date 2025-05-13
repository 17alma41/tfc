// WelcomePage.jsx

import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './WelcomePage.module.css';
import heroImg from '../../assets/hero.jpg';

export default function WelcomePage() {
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Bloquear scroll de body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Cierra el menú al navegar
  const handleLinkClick = () => setMenuOpen(false);

  // Cierra menú y hace scroll arriba
  const handleLogoClick = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* Logo enlazado al root con scroll-to-top */}
        <Link to="/" onClick={handleLogoClick}>
          <h1 className={styles.logo}>Hair Salon</h1>
        </Link>

        <button
          className={styles.navToggle}
          onClick={() => setMenuOpen(open => !open)}
          aria-label="Toggle menu"
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>

        <nav className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          {!isAuthenticated && (
            <>
              <Link to="login" onClick={handleLinkClick}>Iniciar sesión</Link>
              <Link to="register" onClick={handleLinkClick}>Registrarse</Link>
            </>
          )}
          {isAuthenticated && user.role === 'superadmin' && (
            <Link to="/dashboard/superadmin" onClick={handleLinkClick}>
              Mi panel (SuperAdmin)
            </Link>
          )}
          {isAuthenticated && user.role === 'admin' && (
            <Link to="/dashboard/admin" onClick={handleLinkClick}>
              Mi panel (Admin)
            </Link>
          )}
          {isAuthenticated && user.role === 'trabajador' && (
            <Link to="/dashboard/worker" onClick={handleLinkClick}>
              Mi panel (Trabajador)
            </Link>
          )}
          {isAuthenticated && user.role === 'cliente' && (
            <>
              <Link to="/dashboard/client" onClick={handleLinkClick}>
                Mi panel
              </Link>
              <Link to="reservar" onClick={handleLinkClick}>
                Reservar
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className={styles.hero}>
        <img src={heroImg} alt="Barber background" />
        <h2 className={styles.heroTitle}>Hair Salon</h2>
      </section>

      <section className={styles.intro}>
        <p className={styles.introText}>
          Somos un grupo de trabajadoras y trabajadores que damos los mejores
          servicios a nuestros clientes para que queden totalmente{' '}
          <span style={{ color: 'var(--orange)' }}>satisfechos</span>.
        </p>
        <button className={styles.introBtn}>Nuestro trabajo</button>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Reserva tu cita</h2>
        <Link to="/reservar" onClick={handleLinkClick}>
          <button className={styles.ctaBtn}>Reservar</button>
        </Link>
      </section>

      <section className={styles.contact}>
        <h3 className={styles.contactTitle}>Contáctanos</h3>
        <p className={styles.contactText}>
          Si ha tenido alguna incidencia o quiere trabajar con nosotros,
          háganoslo saber,{' '}
          <span style={{ color: 'var(--orange)' }}>te ayudaremos</span>.
        </p>
        <form>
          <input type="text" placeholder="Nombre" required className={styles.contactInput} />
          <input type="email" placeholder="Email" required className={styles.contactInput} />
          <textarea placeholder="Motivo" rows="3" required className={styles.contactTextarea} />
          <button type="submit" className={styles.contactBtn}>
            Enviar
          </button>
        </form>
      </section>

      <footer className={styles.footer}>
        <nav className={styles.footerNav}>
          <Link to="/" onClick={handleLinkClick}>Inicio</Link>
          <Link to="/" onClick={handleLinkClick}>Nuestro trabajo</Link>
          <Link to="/reservar" onClick={handleLinkClick}>Reservar</Link>
          <Link to="/" onClick={handleLinkClick}>Contacto</Link>
        </nav>
        <p className={styles.footerText}>
          ©2025 Álvaro TFC &nbsp;|&nbsp;
          <Link to="/" onClick={handleLinkClick}>Terms</Link> &nbsp;|&nbsp;
          <Link to="/" onClick={handleLinkClick}>Privacy</Link> &nbsp;|&nbsp;
          <Link to="/" onClick={handleLinkClick}>Cookies</Link>
        </p>
      </footer>

      <Outlet />
    </div>
  );
}
