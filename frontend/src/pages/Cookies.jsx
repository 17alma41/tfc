import { Link } from 'react-router-dom';
import styles from './LegalPage.module.css';

export default function Cookies() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>Hair Salon</Link>
      </header>

      <main style={{ padding: '2rem' }}>
        <h1>Política de Cookies</h1>

        <p>
          Al navegar en este sitio aceptas el uso de cookies. A continuación
          detallamos su tipología:
        </p>

        <h2>1. Cookies Técnicas</h2>
        <p>
          Son estrictamente necesarias para el funcionamiento del sistema de
          reservas y tu sesión.
        </p>

        <h2>2. Cookies Analíticas</h2>
        <p>
          Google Analytics recopila datos de uso (páginas vistas, tiempo de
          navegación, origen de la visita) de forma anónima. Estas cookies
          permiten mejorar el rendimiento y la experiencia de usuario.
        </p>

        <h2>Cómo desactivar las cookies</h2>
        <p>
          Puedes rechazar las analíticas desde nuestro banner de cookies o
          configurarlo en tu navegador:
        </p>
        <ul>
          <li>Chrome: <em>Configuración &gt; Privacidad y seguridad &gt; Cookies</em></li>
          <li>Firefox: <em>Opciones &gt; Privacidad &gt; Cookies y datos de sitios</em></li>
          <li>Safari: <em>Preferencias &gt; Privacidad &gt; Gestionar datos de sitios web</em></li>
        </ul>
      </main>
    </div>
  );
}
