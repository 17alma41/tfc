import { useState, useEffect } from 'react';
import styles from './CookieBanner.module.css';

const COOKIE_CONSENT_KEY = 'cookie_consent'; // 'accepted' | 'rejected'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent !== 'accepted' && consent !== 'rejected') {
      setVisible(true);
    } else if (consent === 'accepted') {
      loadGoogleAnalytics();
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    loadGoogleAnalytics();
    setVisible(false);
  };

  const rejectAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setVisible(false);
  };

  function loadGoogleAnalytics() {
    // evita doble carga
    if (!window.ga) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-355309323'; // tu ID
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-355309323');
    }
  }

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <p className={styles.text}>
        Usamos cookies propias y de terceros para mejorar tu experiencia
        (analíticas con Google Analytics). Puedes aceptar todas, rechazar
        las no esenciales o configurar tus preferencias.
      </p>
      <div className={styles.buttons}>
        <button onClick={acceptAll} className={styles.accept}>
          Aceptar todas
        </button>
        <button onClick={rejectAll} className={styles.reject}>
          Rechazar no esenciales
        </button>
      </div>
    </div>
  );
}
