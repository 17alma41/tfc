# Documentación general

## Sistema de Reservas orientada para Barbería/Peluquería

Aplicación web fullstack que permite gestionar reservas de citas para una barbería. Desarrollada como Trabajo de Fin de Ciclo para el Grado de Desarrollo de Aplicaciones Multiplataforma (DAM).

###  Tecnologías utilizadas

- **Frontend**: React + Vite, React Router, Axios, CSS Modules
- **Backend**: Node.js, Express, SQLite (con better-sqlite3)
- **Autenticación**: JWT con cookies
- **Notificaciones**: Email (con SendGrid)
- **Deploy**:

### Estructura del proyecto
```
tfc/
├── backend/         # API REST con autenticación, reservas, servicios
├── frontend/        # SPA en React para clientes, trabajadores y admins
├── package.json     # Paquete con las dependencias
├── README.md        # Documentación general (este archivo)
```

### Arrancar el proyecto (modo local)

1. Clonar el repositorio
```bash
git clone https://github.com/17alma41/tfc.git
cd tfc
```

2. Instala dependencias 
```bash
npm install
```

3. Configuras los ``.env``
   
**Backend** ``.env``

    # Entorno
    NODE_ENV=development # development | production
    PORT=3000

    # Claves secretas para la firma de tokens JWT y superadministrador
    JWT_SECRET=tu_clave_secreta
    SUPERADMIN_SECRET=TuSecretoUltraSeguro

    # URL del frontend para la verificación de tokens
    FRONTEND_URL=http://localhost:5173

    # — Desarrollo (Mailtrap)
    EMAIL_HOST_DEV=smtp.mailtrap.io
    EMAIL_PORT_DEV=2525
    EMAIL_USER_DEV=TU_USUARIO_MAILTRAP
    EMAIL_PASS_DEV=TU_PASS_MAILTRAP

    # — Producción (SendGrid SMTP relay)
    EMAIL_HOST_PROD=smtp.sendgrid.net
    EMAIL_PORT_PROD=587
    EMAIL_USER_PROD=apikey
    EMAIL_PASS_PROD=TU_SENDGRID_API_KEY

    # Remitente autorizado en SendGrid
    FROM_EMAIL=tu@dominio-verificado.com

    # Google OAuth
    GOOGLE_CLIENT_ID=TU_CLIENT_ID
    GOOGLE_CLIENT_SECRET=TU_CLIENT_SECRET
    GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

    # SSL
    SSL_KEY_PATH=./ssl/key.pem
    SSL_CERT_PATH=./ssl/cert.pem


4. Ejecuta el entorno
   
    2.1  En la ventana de la terminal

     ```bash
     # Iniciamos backend y frontend
     npm start
    ```
    *Sugerencia:* Para ver logs con más claridad, iniciar backend y frontend con ventanas distintas de la terminal con los siguientes comandos:

    ```bash
     # Una ventana para abrir backend
     npm run start:backend

     # Otra ventana para abrir frontend
     npm run start:frontend
    ```
    
2. Revisar en nuestro navegador que se hayan abierto las dos pestañas
   
    - Backend: http://localhost:3000
    - Frontend: http://localhost:5173

### Probar la aplicación como un usuario

Roles de usuarios: 

- **Cliente**: reserva, perfil, recibe confirmación por correo.
- **Trabajador**: gestiona su disponibilidad, reservas y perfil.
- **Administrador**: gestiona usuarios, servicios y controla el sistema.
- **Super Admin**: gestiona todo.

#### Cliente:

**Email**: alvaro@gmail.com

**Password**: alvaro


#### Trabajador:

**Email**: worker@gmail.com

**Password**: worker

#### Admin:

**Email**: admin@gmail.com

**Password**: admin

### Funcionalidades importantes

- Sistema de autenticación por roles.
- Gestión de disponibilidad y días bloqueados.
- Reserva con notificación por email.
- Paneles personalizados según el rol.
- Páginas legales: privacidad, cookies, términos.

### Despliegue