# Documentación del Backend

**1**. Descripción del backend
   
   API REST que gestiona usuarios, servicios, reservas, disponibilidad. Está diseñada para integrarse con un frontend React y maneja autenticación
   de usuarios con JWT.

**2**. Estructura de carpetas
```
   src/
    ├── controllers/        # Lógica de negocio
    ├── routes/             # Endpoints de la API
    ├── middleware/         # Autenticación y control de acceso
    ├── config/             # Configuración de la base de datos y servicios externos
    ├── index.js            # Punto de entrada de la API 
```

**3**. Autenticación y seguridad

    - Uso de JWT con cookies.
    - Middleware `verifyToken` (verificar token de cada usuario) y `requireRole` (para comprobar que cada usuario tiene su rol correspondiente al entrar a una ruta en concreto).
    - Encriptación de datos sensibles.
    - Validaciones antes de introducir cualquier dato a la base de datos.
    - Cumplimiento con GDPR.

**4**. Rutas principales (Endpoints)

**Autenticación** (``/api/auth``)

- ``POST /register`` - Registro de usuario y contiene un limite de peticiones.
- ``POST /login`` - Inicio de sesión y contiene un limite de peticiones.
- ``POST /logout`` - Cierre de sesión.
- ``POST /forgot-password`` - Recuperar contraseña.
- ``POST /reset-password`` - Resetear contraseña.
- ``GET /verify-email`` - Verificación por token.
- ``GET /profile`` - Perfil del usuario.
- ``GET /users`` - Obtener todos los usuarios.
- ``GET /users/workers`` - Obtener todos los trabajadores.
- ``GET /google`` - Inicio flujo de OAuth.

**Servicios** (``/api/services``)

- ``GET /`` – Listar servicios.
- ``POST /`` – Crear servicio (rol trabajador/admin).
- ``PUT /:id`` – Editar.
- ``DELETE /:id`` – Eliminar.

**Reservas** (``/api/reservations``)

- ``POST /`` - Crear reserva (cliente) y contiene un limite de peticiones.
- ``DELETE /:id`` - Cancelar reserva y contiene un limite de peticiones.
- ``GET /mine`` - Ver reservas del trabajador logueado.
- ``GET /client`` - Ver reservas del cliente logueado.
- ``GET /available-slots`` - Disponibilidad del trabajador logueado.

**Horario de disonibilidad**

- ``GET /:worker_id`` – Obtener disponibilidad.
- ``POST /`` – Crear disponibilidad.
- ``PUT /:id`` – Actualizar disponibilidad.
- ``DELETE /:id`` – Eliminar. 

**Horario de NO disponibilidad**

- ``GET /:worker_id`` – Obtener no disponibilidad.
- ``POST /`` – Crear no disponibilidad.
- ``DELETE /:id`` – Eliminar. 

**Usuarios** (``/api/users``)

-  ``POST /`` - Crear nuevo usuario (solo admin/superadmin).
-  ``GET /`` - Listar TODOS los usuarios. 
-  ``GET /workers`` - Listar solo trabajadores.
-  ``GET /public-workers`` - Ruta pública (sin autenticación).
-  ``GET /:id/reservations`` - Obtener reservas por trabajador.
-  ``PUT /:id`` - Actualizar datos de usuario.
-  ``DELETE /:id`` - Eliminar usuario y datos asociados.

**5**. ⚙️ Variables de Entorno (`.env`)

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

**6**. ▶️ Ejecución
```bash
npm install

npm run start:backend
```

