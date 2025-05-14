import { Link } from 'react-router-dom';
import styles from './LegalPage.module.css';

export default function Privacy() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>Hair Salon</Link>
      </header>

      <main style={{ padding: '2rem' }}>
        <h1>Política de Privacidad</h1>

        <h2>Responsable del Tratamiento</h2>
        <p>
          Álvaro Román Bermúdez<br/>
          Correo: alvaroromanbermudez@gmail.com
        </p>

        <h2>Datos que Recogemos</h2>
        <ul>
          <li>Nombre, email y contraseña (registro/autenticación).</li>
          <li>Teléfono (al confirmar cita).</li>
          <li>Datos de navegación (Google Analytics).</li>
        </ul>

        <h2>Finalidad</h2>
        <p>
          Gestionar tu cuenta y tus reservas, y mejorar el sitio con
          estadísticas de uso.
        </p>

        <h2>Base Legal</h2>
        <p>
          Tu consentimiento al registrarte y al aceptar cookies
          analíticas.
        </p>

        <h2>Conservación</h2>
        <p>Tu información se conserva mientras mantengas la cuenta activa.</p>

        <h2>Destinatarios</h2>
        <p>
          Los datos de analytics se comparten con Google Ireland Limited
          bajo las condiciones de sus servicios.
        </p>

        <h2>Tus Derechos</h2>
        <p>
          Puedes solicitar acceso, rectificación, supresión,
          portabilidad y oposición en alvaroromanbermudez@gmail.com.
        </p>
      </main>
    </div>
  );
}
