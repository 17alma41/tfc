import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LegalPage.module.css';

export default function Terms() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/">
          <h1 className={styles.logo}>Hair Salon</h1>
        </Link>
      </header>

      <main>
        <h1>Términos y Condiciones</h1>
        <p>
          Bienvenido a Hair Salon, desarrollado por Álvaro Román Bermúdez.
          Estos Términos regulan el uso de este sitio y del sistema de reservas.
        </p>
        <h2>1. Aceptación</h2>
        <p>
          Al acceder y usar nuestro servicio, declaras ser mayor de 18 años
          y aceptas estos términos en su totalidad.
        </p>
        <h2>2. Propiedad Intelectual</h2>
        <p>
          Todos los contenidos (textos, imágenes, logotipos) son propiedad de
          Álvaro Román Bermúdez o de sus legítimos autores y están protegidos
          por la normativa vigente.
        </p>
        <h2>3. Limitación de Responsabilidad</h2>
        <p>
          Hair Salon se ofrece “tal cual”. No nos hacemos responsables de
          interrupciones o errores ajenos a nuestro control.
        </p>
        <h2>4. Modificaciones</h2>
        <p>
          Podemos actualizar estos Términos en cualquier momento. Te
          recomendamos revisarlos periódicamente.
        </p>
      </main>
    </div>
);
}
