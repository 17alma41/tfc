import React from 'react';
import { Link } from 'react-router-dom';
import styles from './OurWork.module.css';

// Importa aquí tus imágenes reales
import work1 from '../../assets/carousel1.jpg';
import work2 from '../../assets/carousel2.jpg';
import work3 from '../../assets/carousel3.jpg';
import work4 from '../../assets/hero.jpg';

export default function OurWork() {
  const photos = [work1, work2, work3, work4];

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <header className={styles.header}>
        <Link to="/" >
         <h1 className={styles.logo}>Hair Salon</h1>
        </Link>
      </header>

      {/* Título */}
      <h1 className={styles.title}>Nuestro Trabajo</h1>

      {/* Galería */}
      <div className={styles.galleryGrid}>
        {photos.map((src, idx) => (
          <div key={idx} className={styles.galleryItem}>
            <img src={src} alt={`Trabajo ${idx + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
